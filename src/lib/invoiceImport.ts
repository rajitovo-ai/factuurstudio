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
  clientKvkNumber: string
  clientBtwNumber: string
  clientIban: string
  issueDate: string
  dueDate: string
  hasDueDate: boolean
  currencyCode: string
  subtotal: number
  vatTotal: number
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
  findFirst(text, [
    /factuurnummer\s*[:#-]?\s*([A-Za-z0-9/._-]+)/i,
    /factuur\s*nr\.?\s*[:#-]?\s*([A-Za-z0-9/._-]+)/i,
    /invoice\s*(?:number|no\.?|nr\.?)\s*[:#-]?\s*([A-Za-z0-9/._-]+)/i,
  ])

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
    /totaal\s*(?:te\s*betalen)?\s*[:#-]?\s*(?:EUR|\u20ac|USD|\$)?\s*([0-9.,-]+)/i,
    /total\s*(?:due|amount)?\s*[:#-]?\s*(?:EUR|\u20ac|USD|\$)?\s*([0-9.,-]+)/i,
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
  ])

  return normalizeAmount(value)
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

const extractClientName = (text: string, rawText: string) => {
  const direct = findLineAfterLabel(rawText, [/^aan\b/i, /^bill\s*to\b/i, /^klant\b/i])
  if (direct) return direct

  return findFirst(text, [
    /klant\s*[:#-]?\s*([^\n]+)/i,
    /debiteur\s*[:#-]?\s*([^\n]+)/i,
    /bill\s*to\s*[:#-]?\s*([^\n]+)/i,
  ])
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

  const worker = await createWorker('eng+ndl')
  await worker.setParameters?.({
    preserve_interword_spaces: '1',
    user_defined_dpi: '300',
  })

  const pageCount = Math.min(maxPages, pdf.numPages)
  const ocrParts: string[] = []
  const warnings: string[] = []

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
      warnings.push(`OCR fallback niet voltooid: ${message}`)
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

  const clientName = extractClientName(normalized, rawText)
  if (!clientName) warnings.push('Klantnaam niet gevonden; vul handmatig aan.')

  const total = extractTotal(normalized)
  const subtotal = extractSubtotal(normalized)
  const vatTotal = extractVatTotal(normalized)
  if (total <= 0) warnings.push('Totaalbedrag niet gevonden; controleer handmatig.')

  if (!subtotal && vatTotal && total) {
    warnings.push('Subtotaal niet direct gevonden; berekend op basis van totaal en BTW waar mogelijk.')
  }

  if (usedOcr) {
    warnings.push('OCR fallback gebruikt voor scan/slecht leesbare PDF.')
  }

  const email = extractEmail(normalized)

  const finalVatTotal = vatTotal
  const finalSubtotal = subtotal || Math.max(0, total - finalVatTotal)

  return {
    fileName: file.name,
    invoiceNumber,
    companyName: '',
    clientName,
    clientEmail: email,
    clientAddress: findFirst(normalized, [/adres\s*[:#-]?\s*([^\n]+)/i]),
    clientKvkNumber: findFirst(normalized, [/\bkvk\b\s*[:#-]?\s*(\d{8})/i]),
    clientBtwNumber: findFirst(normalized, [/\bbtw\b\s*[:#-]?\s*([A-Z0-9]{8,20})/i]),
    clientIban: findFirst(normalized, [/\b(IBAN\s*[:#-]?\s*[A-Z]{2}\d{2}[A-Z0-9]{10,30})\b/i]).replace(/^IBAN\s*[:#-]?\s*/i, ''),
    issueDate,
    dueDate,
    hasDueDate,
    currencyCode: extractCurrency(normalized),
    subtotal: finalSubtotal,
    vatTotal: finalVatTotal,
    total,
    invoiceDescription: cleanDescription(rawText, file.name),
    usedOcr,
    warnings,
    rawText,
  }
}
