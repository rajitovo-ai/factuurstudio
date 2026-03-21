type PdfJsModule = typeof import('pdfjs-dist')

let pdfJsPromise: Promise<PdfJsModule> | null = null

const loadPdfJs = async () => {
  if (!pdfJsPromise) {
    pdfJsPromise = (async () => {
      const [pdfjsLib, workerModule] = await Promise.all([
        import('pdfjs-dist'),
        import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
      ])
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerModule.default
      return pdfjsLib
    })()
  }

  return pdfJsPromise
}

export type ExtractedInvoiceData = {
  fileName: string
  invoiceNumber: string
  companyName: string
  clientName: string
  clientEmail: string
  clientAddress: string
  clientStreet: string
  clientHouseNumber: string
  clientPostalCode: string
  clientCity: string
  clientKvkNumber: string
  clientBtwNumber: string
  clientIban: string
  issueDate: string
  dueDate: string
  hasDueDate: boolean
  currencyCode: string
  subtotal: number
  vatTotal: number
  vatRate: number
  total: number
  invoiceDescription: string
  usedOcr: boolean
  warnings: string[]
  rawText: string
}

type ExtractInvoiceOptions = {
  useOcrFallback?: boolean
  maxOcrPages?: number
}

const OCR_PRIMARY_TIMEOUT_MS = 90000
const OCR_RETRY_TIMEOUT_MS = 45000
const OCR_TOTAL_TIMEOUT_MS = 180000
const OCR_PRIMARY_SCALE = 2
const OCR_RETRY_SCALE = 2.6
const OCR_PRIMARY_LANG = 'eng+nld'
const OCR_FALLBACK_LANG = 'eng'

const withTimeout = async <T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string,
): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error(timeoutMessage))
        }, timeoutMs)
      }),
    ])
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }
}

const toIsoDate = (value: string) => {
  const normalized = value.trim()

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return normalized
  }

  const match = normalized.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/)
  if (!match) return ''

  const day = match[1].padStart(2, '0')
  const month = match[2].padStart(2, '0')
  const year = match[3].length === 2 ? `20${match[3]}` : match[3]
  return `${year}-${month}-${day}`
}

const normalizeAmount = (value: string) => {
  const stripped = value.replace(/[^\d,.-]/g, '')

  if (!stripped) return 0

  const hasComma = stripped.includes(',')
  const hasDot = stripped.includes('.')

  if (hasComma && hasDot) {
    const european = stripped.replace(/\./g, '').replace(',', '.')
    const parsed = Number(european)
    return Number.isNaN(parsed) ? 0 : parsed
  }

  if (hasComma) {
    const parsed = Number(stripped.replace(',', '.'))
    return Number.isNaN(parsed) ? 0 : parsed
  }

  const parsed = Number(stripped)
  return Number.isNaN(parsed) ? 0 : parsed
}

const findFirst = (text: string, patterns: RegExp[]) => {
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match?.[1]) {
      return match[1].trim()
    }
  }

  return ''
}

const findLineAfterLabel = (rawText: string, labels: RegExp[]) => {
  const lines = rawText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  for (let i = 0; i < lines.length; i += 1) {
    const current = lines[i]
    if (!labels.some((label) => label.test(current))) {
      continue
    }

    const sameLine = current.split(':').slice(1).join(':').trim()
    if (sameLine) {
      return sameLine
    }

    if (lines[i + 1]) {
      return lines[i + 1]
    }
  }

  return ''
}

const extractInvoiceNumber = (text: string) =>
  {
    const candidate = findFirst(text, [
      /factuurnummer\s*[:#-]?\s*([A-Za-z0-9/._-]+)/i,
      /factuur\s*nr\.?\s*[:#-]?\s*([A-Za-z0-9/._-]+)/i,
      /invoice\s*(?:number|no\.?|nr\.?)\s*[:#-]?\s*([A-Za-z0-9/._-]+)/i,
    ])

    const cleaned = candidate.trim()
    if (!cleaned) return ''
    if (/^(btw|vat|kvk|iban|swift|bic)$/i.test(cleaned)) return ''

    const hasDigit = /\d/.test(cleaned)
    if (!hasDigit && cleaned.length < 5) return ''

    return cleaned
  }

const extractIssueDate = (text: string) =>
  findFirst(text, [
    /factuurdatum\s*[:#-]?\s*([0-9./-]{8,10})/i,
    /invoice\s*date\s*[:#-]?\s*([0-9./-]{8,10})/i,
    /datum\s*[:#-]?\s*([0-9./-]{8,10})/i,
  ])

const extractDueDate = (text: string) =>
  findFirst(text, [
    /vervaldatum\s*[:#-]?\s*([0-9./-]{8,10})/i,
    /due\s*date\s*[:#-]?\s*([0-9./-]{8,10})/i,
  ])

const extractTotal = (text: string) => {
  const value = findFirst(text, [
    /(?<!sub)\btotaal\b\s*(?:te\s*betalen)?\s*[:#-]?\s*(?:EUR|\u20ac|USD|\$)?\s*([0-9.,-]+)/i,
    /total\s*(?:due|amount)?\s*[:#-]?\s*(?:EUR|\u20ac|USD|\$)?\s*([0-9.,-]+)/i,
    /te\s*betalen\s*[:#-]?\s*(?:EUR|\u20ac|USD|\$)?\s*([0-9.,-]+)/i,
  ])

  return normalizeAmount(value)
}

const extractSubtotal = (text: string) => {
  const value = findFirst(text, [
    /subtotaal\s*[:#-]?\s*(?:EUR|\u20ac|USD|\$)?\s*([0-9.,-]+)/i,
    /subtotal\s*[:#-]?\s*(?:EUR|\u20ac|USD|\$)?\s*([0-9.,-]+)/i,
  ])

  return normalizeAmount(value)
}

const extractVatTotal = (text: string) => {
  const value = findFirst(text, [
    /\b(?:btw|vat)\b\s*(?:totaal|total)?\s*[:#-]?\s*(?:EUR|\u20ac|USD|\$)?\s*([0-9.,-]+)/i,
    /\b(?:btw|vat|tax)\b\s*(?:\([^)]*\))?\s*[:#-]?\s*(?:EUR|\u20ac|USD|\$)?\s*([0-9.,-]+)/i,
  ])

  return normalizeAmount(value)
}

const extractVatRate = (text: string) => {
  const value = findFirst(text, [
    /\b(?:btw|vat|tax)\b\s*\(?\s*(\d{1,2}(?:[.,]\d{1,2})?)\s*%\s*\)?/i,
    /\b(\d{1,2}(?:[.,]\d{1,2})?)\s*%\s*(?:btw|vat|tax)\b/i,
  ])

  const parsed = Number(value.replace(',', '.'))
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) return 0
  return parsed
}

type ParsedAddressParts = {
  fullAddress: string
  street: string
  houseNumber: string
  postalCode: string
  city: string
}

const parseAddressParts = (address: string): ParsedAddressParts => {
  const normalized = address.replace(/\s+/g, ' ').trim()
  if (!normalized) {
    return {
      fullAddress: '',
      street: '',
      houseNumber: '',
      postalCode: '',
      city: '',
    }
  }

  const postalMatch = normalized.match(/\b(\d{4}\s?[A-Z]{2})\b/i)
  const postalCode = postalMatch?.[1]?.toUpperCase().replace(/\s+/, ' ') ?? ''

  const streetHouseMatch = normalized.match(/^(.*?)(?:\s+)(\d{1,5}[A-Z]?)\b(?:,|$)/i)
  const street = streetHouseMatch?.[1]?.trim() ?? ''
  const houseNumber = streetHouseMatch?.[2]?.trim() ?? ''

  let city = ''
  if (postalCode) {
    const afterPostal = normalized
      .replace(new RegExp(postalCode.replace(' ', '\\s?'), 'i'), '')
      .split(',')
      .map((part) => part.trim())
      .find((part) => part.length > 1 && !/\d/.test(part) && !/(nederland|netherlands)/i.test(part))
    city = afterPostal ?? ''
  }

  if (!city) {
    const parts = normalized.split(',').map((part) => part.trim()).filter(Boolean)
    if (parts.length > 1) {
      const candidate = parts[parts.length - 2]
      if (!/\d/.test(candidate)) {
        city = candidate
      }
    }
  }

  return {
    fullAddress: normalized,
    street,
    houseNumber,
    postalCode,
    city,
  }
}

const extractCurrency = (text: string) => {
  if (/\u20ac|\bEUR\b/i.test(text)) return 'EUR'
  if (/\$|\bUSD\b/i.test(text)) return 'USD'
  if (/\bGBP\b|\u00a3/.test(text)) return 'GBP'
  return 'EUR'
}

const extractEmail = (text: string) => {
  const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)
  return match?.[0]?.trim() ?? ''
}

const STOP_WORDS_PATTERN =
  /\b(?:kvk|btw|vat|iban|swift|bic|subtotaal|subtotal|totaal|total|omschrijving|description|factuur(?:nummer|datum)?|invoice(?:\s*number|\s*date)?|betaalgegevens|payment\s*details?)\b/i

const VAT_LIKE_PATTERN = /\bNL[0-9O@]{9}(?:B[0-9O@]{2})?\b/gi
const VAT_LIKE_SINGLE_PATTERN = /\bNL[0-9O@]{9}(?:B[0-9O@]{2})?\b/i

const stripVatLikeTokens = (value: string) =>
  value
    .replace(VAT_LIKE_PATTERN, ' ')
    .replace(/\b(?:btw|vat)\b\s*[:#-]?\s*$/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim()

const sanitizeExtractedValue = (value: string) =>
  stripVatLikeTokens(
    value
    .replace(/^\s*(?:aan|klant|debiteur|bill\s*to|gegevens|adres)\s*[:#-]?\s*/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim(),
  )

const truncateAtStopWords = (value: string) => {
  const match = value.match(STOP_WORDS_PATTERN)
  const truncated = match ? value.slice(0, match.index).trim() : value.trim()
  return sanitizeExtractedValue(truncated.replace(/[,:;-]+$/, ''))
}

const toCandidateLines = (rawText: string) => {
  const expanded = rawText
    .replace(/\r/g, '\n')
    .replace(
      /\s+(?=(?:kvk|btw|vat|iban|swift|bic|subtotaal|subtotal|totaal|total|factuurdatum|invoice\s*date|vervaldatum|due\s*date|email|e-mail|adres|omschrijving|description)\s*:)/gi,
      '\n',
    )

  return expanded
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

const isLikelyMetaOrTotalsLine = (line: string) => {
  const hasAmount = /(?:\u20ac|eur|usd|gbp|\$)\s*\d|\b\d+[.,]\d{2}\b/i.test(line)
  const hasMetaKeyword =
    /\b(?:factuur|invoice|subtotaal|subtotal|totaal|total|btw|vat|iban|swift|bic|kvk|omschrijving|description|betaalgegevens|payment)\b/i.test(
      line,
    )
  return hasAmount || hasMetaKeyword
}

const extractClientName = (rawText: string) => {
  const streetLikePattern =
    /(?:[A-Za-z]+(?:straat|laan|weg|plein|gracht|kade|singel|dreef|steeg|boulevard|hof|park)|\b(?:straat|laan|weg|plein|gracht|kade|singel|dreef|steeg|boulevard|hof|park)\b)/i

  const direct = findLineAfterLabel(rawText, [/^aan\b/i, /^bill\s*to\b/i, /^klant\b/i, /^debiteur\b/i])
  if (direct) {
    const cleaned = truncateAtStopWords(direct)
    if (cleaned.length >= 2) return cleaned
  }

  const embedded = rawText.match(
    /(?:aan|klant|debiteur|bill\s*to|gegevens)\s*[:#-]?\s*([^\n]{2,160}?)(?=\s*(?:kvk|btw|vat|iban|swift|bic|subtotaal|subtotal|totaal|total|omschrijving|description|factuur|invoice)\b|$)/i,
  )
  if (embedded?.[1]) {
    const cleaned = truncateAtStopWords(embedded[1])
    if (cleaned.length >= 2) return cleaned
  }

  const lines = toCandidateLines(rawText)
  for (const line of lines) {
    const cleaned = truncateAtStopWords(line)
    if (!cleaned || cleaned.length < 2 || cleaned.length > 80) continue
    if (VAT_LIKE_SINGLE_PATTERN.test(cleaned)) continue
    if (extractEmail(cleaned)) continue
    if (/\d{4}\s?[A-Z]{2}/i.test(cleaned)) continue
    if (/\b\d{1,5}[A-Z]?\b/.test(cleaned) && streetLikePattern.test(cleaned)) continue
    if (isLikelyMetaOrTotalsLine(cleaned)) continue

    const digitCount = (cleaned.match(/\d/g) ?? []).length
    if (digitCount > 4) continue

    return cleaned
  }

  return ''
}

const extractClientAddress = (rawText: string, normalizedText: string) => {
  const streetToken = '(?:[A-Za-z]+(?:straat|laan|weg|plein|gracht|kade|singel|dreef|steeg|boulevard|hof|park)|straat|laan|weg|plein|gracht|kade|singel|dreef|steeg|boulevard|hof|park)'

  const direct = findLineAfterLabel(rawText, [/^adres\b/i, /^address\b/i])
  if (direct) {
    const cleaned = truncateAtStopWords(direct)
    if (cleaned) return cleaned
  }

  const inlineAddress = normalizedText.match(
    new RegExp(
      `([A-Za-z][A-Za-z0-9' .-]{1,80}${streetToken}[^\\n]{0,80}?\\b\\d{1,5}[A-Z]?\\b[^\\n]{0,100}?)(?=\\b(?:omschrijving|description|subtotaal|subtotal|totaal|total|kvk|btw|vat|iban|factuur|invoice|betaalgegevens)\\b|$)`,
      'i',
    ),
  )
  if (inlineAddress?.[1]) {
    const cleaned = truncateAtStopWords(inlineAddress[1])
    if (cleaned) return cleaned
  }

  const lines = toCandidateLines(rawText)
  const streetPattern = new RegExp(streetToken, 'i')
  const houseNumberPattern = /\b\d{1,5}[A-Z]?\b/
  const postalCodePattern = /\b\d{4}\s?[A-Z]{2}\b/

  for (const line of lines) {
    const cleaned = truncateAtStopWords(line)
    if (!cleaned || cleaned.length < 6) continue
    if (extractEmail(cleaned)) continue
    if (isLikelyMetaOrTotalsLine(cleaned)) continue

    const hasStreetAndNumber = streetPattern.test(cleaned) && houseNumberPattern.test(cleaned)
    const hasPostalCode = postalCodePattern.test(cleaned)
    if (hasStreetAndNumber || hasPostalCode) {
      return cleaned
    }
  }

  return truncateAtStopWords(findFirst(normalizedText, [/adres\s*[:#-]?\s*([^\n]+)/i]))
}

const normalizeVatNumber = (value: string) =>
  value
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/@/g, '0')
    .replace(/O(?=\d)/g, '0')
    .replace(/(?<=\d)O/g, '0')

const extractKvkNumber = (normalizedText: string) => {
  const labeled = findFirst(normalizedText, [/\bkvk\b\s*[:#-]?\s*(\d{8})/i])
  if (labeled) return labeled

  const fallback = normalizedText.match(/\b\d{8}\b/)
  return fallback?.[0] ?? ''
}

const extractBtwNumber = (normalizedText: string) => {
  const labeled = findFirst(normalizedText, [
    /\b(?:btw|vat)\b\s*[:#-]?\s*([A-Z0-9@]{8,24})/i,
    /\b(?:btw|vat)\b\s*\([^)]*\)\s*[:#-]?\s*([A-Z0-9@]{8,24})/i,
  ])
  if (labeled) {
    return normalizeVatNumber(labeled)
  }

  const nlBtwMatch = normalizedText.match(/\bNL[0-9O@]{9}B[0-9O@]{2}\b/i)
  return nlBtwMatch ? normalizeVatNumber(nlBtwMatch[0]) : ''
}

const extractIban = (rawText: string, normalizedText: string) => {
  const isValidIban = (candidate: string) => {
    const iban = candidate.toUpperCase().replace(/\s+/g, '')
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)) return false

    const rearranged = `${iban.slice(4)}${iban.slice(0, 4)}`
    let remainder = 0

    for (const char of rearranged) {
      const numeric = /[A-Z]/.test(char) ? String(char.charCodeAt(0) - 55) : char
      for (const digit of numeric) {
        remainder = (remainder * 10 + Number(digit)) % 97
      }
    }

    return remainder === 1
  }

  const findValidIbanInText = (value: string, ignoreFromPaymentSection: boolean) => {
    const lines = toCandidateLines(value)
    const paymentStart = lines.findIndex((line) =>
      /\b(?:betaalgegevens|payment\s*details|bankgegevens|bank\s*details|bank account|swift|bic)\b/i.test(line),
    )

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
      if (ignoreFromPaymentSection && paymentStart >= 0 && lineIndex >= paymentStart) {
        continue
      }

      const line = lines[lineIndex]
      const matches = line.match(/\b[A-Z]{2}\d{2}(?:\s?[A-Z0-9]{4}){2,7}(?:\s?[A-Z0-9]{1,2})?\b/gi) ?? []
      for (const match of matches) {
        const compact = match.replace(/\s+/g, '')
        if (isValidIban(compact)) {
          return compact
        }
      }
    }

    return ''
  }

  const extractIbanFromLabeledSegment = (value: string) => {
    const segment = value.match(/\biban\b\s*[:#-]?\s*([^\n]+)/i)?.[1]
    if (!segment) return ''

    const tokens = segment
      .replace(/[^A-Z0-9\s]/gi, ' ')
      .split(/\s+/)
      .filter(Boolean)
      .map((token) => token.toUpperCase())

    const startIndex = tokens.findIndex((token) => /^[A-Z]{2}\d{2}[A-Z0-9]{0,4}$/.test(token))
    if (startIndex < 0) return ''

    let compact = tokens[startIndex]
    for (let i = startIndex + 1; i < tokens.length; i += 1) {
      const token = tokens[i]
      if (token.length > 4) break
      if (!/^[A-Z0-9]+$/.test(token)) break
      if (compact.length + token.length > 34) break
      compact += token
    }

    if (/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(compact)) {
      return compact
    }

    return ''
  }

  const labeled = findFirst(normalizedText, [
    /\biban\b\s*[:#-]?\s*([A-Z]{2}\d{2}[A-Z0-9]{10,30})/i,
    /\biban\b\s*[:#-]?\s*([A-Z]{2}\d{2}(?:\s?[A-Z0-9]{4}){2,7}(?:\s?[A-Z0-9]{1,2})?)/i,
  ])
  if (labeled) {
    const compact = labeled.replace(/\s+/g, '')
    if (isValidIban(compact)) return compact
  }

  const fallbackFromLabeled = extractIbanFromLabeledSegment(rawText) || extractIbanFromLabeledSegment(normalizedText)
  if (fallbackFromLabeled) {
    const hasPaymentSection = /\b(?:betaalgegevens|payment\s*details|bankgegevens|bank\s*details|swift|bic|bank account)\b/i.test(rawText)
    return hasPaymentSection ? '' : fallbackFromLabeled
  }

  return findValidIbanInText(rawText, true) || findValidIbanInText(normalizedText, true)
}

const cleanDescription = (rawText: string, fileName: string) => {
  const lines = rawText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const hint = lines.find((line) => /omschrijving|description|project|werkzaamheden/i.test(line))
  if (hint) {
    return `Geimporteerde factuur (${fileName}) - ${hint}`
  }

  return `Geimporteerde factuur uit PDF: ${fileName}`
}

const extractTextFromPdf = async (file: File) => {
  const pdfjsLib = await loadPdfJs()
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise

  const textParts: string[] = []

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .trim()
    textParts.push(pageText)
  }

  return { pdf, rawText: textParts.join('\n') }
}

type PdfDocument = Awaited<ReturnType<PdfJsModule['getDocument']>['promise']>

type OcrWorker = {
  recognize: (image: string) => Promise<{ data: { text?: string } }>
  setParameters?: (params: Record<string, string>) => Promise<void>
  terminate: () => Promise<void>
}

const renderPageToCanvas = async (pdf: PdfDocument, pageNumber: number, scale: number) => {
  const page = await pdf.getPage(pageNumber)
  const viewport = page.getViewport({ scale })

  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(viewport.width)
  canvas.height = Math.ceil(viewport.height)
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('canvas context niet beschikbaar')
  }

  await page.render({ canvas, canvasContext: context, viewport }).promise
  return canvas
}

const preprocessCanvasForOcr = (sourceCanvas: HTMLCanvasElement) => {
  const canvas = document.createElement('canvas')
  canvas.width = sourceCanvas.width
  canvas.height = sourceCanvas.height
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('canvas context niet beschikbaar voor OCR preprocessing')
  }

  context.drawImage(sourceCanvas, 0, 0)
  const image = context.getImageData(0, 0, canvas.width, canvas.height)
  const { data } = image

  let luminanceSum = 0
  const luminanceValues: number[] = []

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const luminance = Math.round(0.299 * r + 0.587 * g + 0.114 * b)
    luminanceValues.push(luminance)
    luminanceSum += luminance
  }

  const avg = luminanceValues.length > 0 ? luminanceSum / luminanceValues.length : 128
  const threshold = Math.max(95, Math.min(180, avg * 0.95))

  let pixelIndex = 0
  for (let i = 0; i < data.length; i += 4) {
    const lum = luminanceValues[pixelIndex]
    const normalized = lum < threshold ? 0 : 255
    data[i] = normalized
    data[i + 1] = normalized
    data[i + 2] = normalized
    data[i + 3] = 255
    pixelIndex += 1
  }

  context.putImageData(image, 0, 0)
  return canvas
}

const scoreOcrText = (text: string) => {
  const compact = text.replace(/\s+/g, ' ').trim()
  if (!compact) return 0

  const tokenCount = compact.split(' ').length
  const keywordHits =
    (/(factuur|invoice)/i.test(compact) ? 1 : 0) +
    (/(totaal|total)/i.test(compact) ? 1 : 0) +
    (/(btw|vat)/i.test(compact) ? 1 : 0) +
    (/(datum|date)/i.test(compact) ? 1 : 0)

  return compact.length + tokenCount * 5 + keywordHits * 120
}

const runOcrPass = async (worker: OcrWorker, image: string, timeoutMs: number, timeoutMessage: string) => {
  const result = await withTimeout(worker.recognize(image), timeoutMs, timeoutMessage)
  return result.data.text?.trim() ?? ''
}

const runOcrWithRetry = async (
  worker: OcrWorker,
  pdf: PdfDocument,
  pageNumber: number,
) => {
  const localWarnings: string[] = []
  let primaryText = ''

  const primaryCanvas = await renderPageToCanvas(pdf, pageNumber, OCR_PRIMARY_SCALE)
  const primaryImage = primaryCanvas.toDataURL('image/png')

  try {
    primaryText = await runOcrPass(
      worker,
      primaryImage,
      OCR_PRIMARY_TIMEOUT_MS,
      `OCR timeout op pagina ${pageNumber}.`,
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Onbekende OCR-fout.'
    localWarnings.push(`OCR primair mislukt op pagina ${pageNumber}: ${message}`)
  }

  const retryCanvas = await renderPageToCanvas(pdf, pageNumber, OCR_RETRY_SCALE)
  const processedRetryCanvas = preprocessCanvasForOcr(retryCanvas)
  const retryImage = processedRetryCanvas.toDataURL('image/png')
  let retryText = ''

  try {
    retryText = await runOcrPass(
      worker,
      retryImage,
      OCR_RETRY_TIMEOUT_MS,
      `OCR retry timeout op pagina ${pageNumber}.`,
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Onbekende OCR-fout.'
    localWarnings.push(`OCR retry mislukt op pagina ${pageNumber}: ${message}`)
  }

  if (!primaryText && !retryText) {
    throw new Error(`OCR timeout/fout op pagina ${pageNumber} in zowel primaire als retry pass.`)
  }

  const primaryScore = scoreOcrText(primaryText)
  const retryScore = scoreOcrText(retryText)

  if (retryScore > primaryScore) {
    return {
      text: retryText,
      warnings:
        retryText && primaryText
          ? [...localWarnings, `OCR preprocessing verbeterde resultaat op pagina ${pageNumber}.`]
          : localWarnings,
    }
  }

  return {
    text: primaryText,
    warnings: localWarnings,
  }
}

const runOcrFallback = async (pdf: PdfDocument, maxPages: number) => {
  const tesseract = await import('tesseract.js')
  const createWorker = (tesseract as unknown as { createWorker: (langs?: string) => Promise<OcrWorker> })
    .createWorker

  const pageCount = Math.min(maxPages, pdf.numPages)
  const ocrParts: string[] = []
  const warnings: string[] = []
  let worker: OcrWorker

  try {
    worker = await withTimeout(
      createWorker(OCR_PRIMARY_LANG),
      30000,
      `OCR worker start timeout voor talen ${OCR_PRIMARY_LANG}.`,
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Onbekende OCR-startfout.'
    warnings.push(
      `OCR taalset ${OCR_PRIMARY_LANG} niet beschikbaar (${message}); fallback naar ${OCR_FALLBACK_LANG}.`,
    )

    worker = await withTimeout(
      createWorker(OCR_FALLBACK_LANG),
      30000,
      `OCR worker start timeout voor taal ${OCR_FALLBACK_LANG}.`,
    )
  }

  await worker.setParameters?.({
    preserve_interword_spaces: '1',
    user_defined_dpi: '300',
  })

  try {
    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      try {
        const result = await runOcrWithRetry(worker, pdf, pageNumber)
        if (result.warnings.length > 0) {
          warnings.push(...result.warnings)
        }

        const text = result.text
        if (text) {
          ocrParts.push(text)
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Onbekende OCR-fout.'
        warnings.push(`OCR probleem op pagina ${pageNumber}: ${message}`)
      }
    }
  } finally {
    await worker.terminate()
  }

  return {
    text: ocrParts.join('\n'),
    warnings,
  }
}

export const extractInvoiceDataFromPdf = async (
  file: File,
  options: ExtractInvoiceOptions = {},
): Promise<ExtractedInvoiceData> => {
  const { useOcrFallback = false, maxOcrPages = 2 } = options
  const { pdf, rawText: extractedText } = await extractTextFromPdf(file)

  let rawText = extractedText
  let usedOcr = false
  const warnings: string[] = []

  if (useOcrFallback && rawText.replace(/\s+/g, '').length < 80) {
    try {
      const ocrResult = await withTimeout(
        runOcrFallback(pdf, maxOcrPages),
        OCR_TOTAL_TIMEOUT_MS,
        'OCR duurde te lang en is gestopt.',
      )

      if (ocrResult.warnings.length > 0) {
        warnings.push(...ocrResult.warnings)
      }

      if (ocrResult.text.trim().length > rawText.trim().length) {
        rawText = ocrResult.text
        usedOcr = true
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Onbekende OCR-fout.'
      warnings.push(`Diepe scan niet voltooid: ${message}`)
    }
  }

  const normalized = rawText.replace(/\s+/g, ' ').trim()

  const issueDateRaw = extractIssueDate(normalized)
  const dueDateRaw = extractDueDate(normalized)
  const issueDate = toIsoDate(issueDateRaw)
  const dueDate = toIsoDate(dueDateRaw)
  const hasDueDate = Boolean(dueDate)

  if (!issueDate) warnings.push('Factuurdatum niet betrouwbaar gevonden.')
  if (!hasDueDate) warnings.push('Vervaldatum niet gevonden; wordt optioneel uitgeschakeld.')

  const invoiceNumber = extractInvoiceNumber(normalized)
  if (!invoiceNumber) warnings.push('Factuurnummer niet gevonden; vul handmatig aan.')

  const clientName = extractClientName(rawText)
  if (!clientName) warnings.push('Klantnaam niet gevonden; vul handmatig aan.')

  const total = extractTotal(normalized)
  const subtotal = extractSubtotal(normalized)
  const vatTotal = extractVatTotal(normalized)
  const vatRate = extractVatRate(normalized)
  if (total <= 0) warnings.push('Totaalbedrag niet gevonden; controleer handmatig.')

  if (!subtotal && vatTotal && total) {
    warnings.push('Subtotaal niet direct gevonden; berekend op basis van totaal en BTW waar mogelijk.')
  }

  if (usedOcr) {
    warnings.push('Diepe scan gebruikt voor scan/slecht leesbare PDF.')
  }

  const email = extractEmail(rawText) || extractEmail(normalized)
  const parsedAddress = parseAddressParts(extractClientAddress(rawText, normalized))
  const clientAddress = parsedAddress.fullAddress
  const clientKvkNumber = extractKvkNumber(normalized)
  const clientBtwNumber = extractBtwNumber(normalized)
  const clientIban = extractIban(rawText, normalized)

  const finalVatTotal =
    vatTotal > 0
      ? vatTotal
      : subtotal > 0 && vatRate > 0
        ? Number(((subtotal * vatRate) / 100).toFixed(2))
        : 0
  const finalSubtotal = subtotal || Math.max(0, total - finalVatTotal)
  const finalTotal = total > 0 ? total : Number((finalSubtotal + finalVatTotal).toFixed(2))

  return {
    fileName: file.name,
    invoiceNumber,
    companyName: '',
    clientName,
    clientEmail: email,
    clientAddress,
    clientStreet: parsedAddress.street,
    clientHouseNumber: parsedAddress.houseNumber,
    clientPostalCode: parsedAddress.postalCode,
    clientCity: parsedAddress.city,
    clientKvkNumber,
    clientBtwNumber,
    clientIban,
    issueDate,
    dueDate,
    hasDueDate,
    currencyCode: extractCurrency(normalized),
    subtotal: finalSubtotal,
    vatTotal: finalVatTotal,
    vatRate,
    total: finalTotal,
    invoiceDescription: cleanDescription(rawText, file.name),
    usedOcr,
    warnings,
    rawText,
  }
}
