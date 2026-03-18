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

const runOcrFallback = async (pdf: PdfDocument, maxPages: number) => {
  const { recognize } = await import('tesseract.js')
  const pageCount = Math.min(maxPages, pdf.numPages)
  const ocrParts: string[] = []
  const warnings: string[] = []

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    try {
      const page = await pdf.getPage(pageNumber)
      const viewport = page.getViewport({ scale: 2 })

      const canvas = document.createElement('canvas')
      canvas.width = Math.ceil(viewport.width)
      canvas.height = Math.ceil(viewport.height)
      const context = canvas.getContext('2d')
      if (!context) {
        warnings.push(`OCR overgeslagen voor pagina ${pageNumber}: canvas context niet beschikbaar.`)
        continue
      }

      await page.render({ canvas, canvasContext: context, viewport }).promise
      const dataUrl = canvas.toDataURL('image/png')

      const result = await withTimeout(
        recognize(dataUrl, 'eng+ndl'),
        25000,
        `OCR timeout op pagina ${pageNumber}.`,
      )

      const text = result.data.text?.trim()
      if (text) {
        ocrParts.push(text)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Onbekende OCR-fout.'
      warnings.push(`OCR probleem op pagina ${pageNumber}: ${message}`)
    }
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
        60000,
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
