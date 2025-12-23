import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

// =====================================================
// DIACRITICS HANDLING
// =====================================================
// Standard PDF fonts (Helvetica, etc.) don't support Romanian diacritics.
// We normalize them to ASCII equivalents for PDF rendering.

const DIACRITICS_MAP: Record<string, string> = {
  'ă': 'a', 'Ă': 'A',
  'â': 'a', 'Â': 'A',
  'î': 'i', 'Î': 'I',
  'ș': 's', 'Ș': 'S',
  'ț': 't', 'Ț': 'T',
  // Alternative forms (cedilla variants)
  'ş': 's', 'Ş': 'S',
  'ţ': 't', 'Ţ': 'T',
};

function removeDiacritics(text: string): string {
  return text.replace(/[ăĂâÂîÎșȘțȚşŞţŢ]/g, (char) => DIACRITICS_MAP[char] || char);
}

// =====================================================
// TYPES
// =====================================================

interface QuoteItem {
  productName: string;
  quantity: number;
  unit: string;
  finalPrice: number;
}

interface QuotePDFData {
  referenceNumber: string;
  companyName: string;
  contactPerson: string;
  items: QuoteItem[];
  finalTotal: number;
  quoteDate: Date;
}

// =====================================================
// TECHNICAL CONDITIONS TEXT (Romanian)
// =====================================================

const TECHNICAL_CONDITIONS_RO = {
  title: removeDiacritics('2. Conditii tehnice'),
  intro: removeDiacritics(`Executia cofectiilor metalice se va realiza in baza documentatiei complete: piese desenate, inclusiv detalii, in format dwg si pdf, lista cu subansamble, repere si materiale cu viza "bun pentru executie", caiete de sarcini.`),

  section2_1_title: removeDiacritics('2.1. Conditii tehnice pentru materiale debitate'),
  section2_1_items: [
    removeDiacritics('Achizitia de materiale de baza - S235JR, insotite de Certificate de calitate pentru materiale tip: 2.1 - EN 10204 / 3.1 - EN 10204'),
    removeDiacritics('Toleranta la grosimea tablei - SREN 10029'),
    removeDiacritics('Aspect exterior al suprafetei materialului SREN 10163'),
    removeDiacritics('Toleranta la debitare oxigaz SREN ISO 9013 cls.2'),
  ],

  section2_2_title: removeDiacritics('2.2. Conditii tehnice pentru confectii'),
  section2_2_items: [
    removeDiacritics('Materiale de aport SREN 10204 (Certificate de calitate)'),
    removeDiacritics('Clase de calitate a imbinarilor sudate SR EN ISO 5817-C'),
    removeDiacritics('Tolerante generale pentru structuri sudate SR EN ISO 13920 cls BF'),
    removeDiacritics('Verificari dimensionale 100%'),
    removeDiacritics('Controale nedistructive suduri 100% vizual'),
    removeDiacritics('Clasa de executie EXC2'),
    removeDiacritics('Protectie anticoroziva - un strat grund si unul de vopsea'),
  ],
};

// =====================================================
// PDF GENERATION SERVICE
// =====================================================

export class PDFService {
  private templatePath: string;

  constructor() {
    // Template path - will be in dist/templates after build
    this.templatePath = path.join(__dirname, '..', 'templates', 'Metal_Direct_Oferta_Template.pdf');
  }

  /**
   * Generate a quote PDF with the Metal Direct template
   */
  async generateQuotePDF(data: QuotePDFData): Promise<Buffer> {
    // Load the template PDF
    let templateBytes: Uint8Array;

    try {
      templateBytes = fs.readFileSync(this.templatePath);
    } catch (error) {
      console.error('Template PDF not found, generating without template');
      return this.generateQuotePDFWithoutTemplate(data);
    }

    const pdfDoc = await PDFDocument.load(templateBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Get page dimensions
    const { width, height } = firstPage.getSize();

    // Embed fonts
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Colors
    const primaryBlue = rgb(0.118, 0.251, 0.686); // #1e40af
    const textBlack = rgb(0, 0, 0);
    const textGray = rgb(0.3, 0.3, 0.3);

    // Starting position (below header)
    let yPosition = height - 100;
    const leftMargin = 50;
    const rightMargin = width - 50;
    const contentWidth = rightMargin - leftMargin;

    // =====================================================
    // DOCUMENT TITLE
    // =====================================================

    firstPage.drawText(removeDiacritics(`OFERTA ${data.referenceNumber}`), {
      x: leftMargin,
      y: yPosition,
      size: 18,
      font: helveticaBold,
      color: primaryBlue,
    });
    yPosition -= 30;

    // Date
    const formattedDate = data.quoteDate.toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    firstPage.drawText(`Data: ${formattedDate}`, {
      x: leftMargin,
      y: yPosition,
      size: 10,
      font: helvetica,
      color: textGray,
    });
    yPosition -= 25;

    // =====================================================
    // CLIENT INFO
    // =====================================================

    firstPage.drawText('Catre:', {
      x: leftMargin,
      y: yPosition,
      size: 10,
      font: helveticaBold,
      color: textBlack,
    });
    yPosition -= 15;

    firstPage.drawText(removeDiacritics(data.companyName), {
      x: leftMargin,
      y: yPosition,
      size: 10,
      font: helvetica,
      color: textBlack,
    });
    yPosition -= 12;

    firstPage.drawText(removeDiacritics(`Att: ${data.contactPerson}`), {
      x: leftMargin,
      y: yPosition,
      size: 10,
      font: helvetica,
      color: textGray,
    });
    yPosition -= 30;

    // =====================================================
    // INTRO TEXT
    // =====================================================

    const introText = removeDiacritics('In urma cererii dumneavoastra, va transmitem oferta noastra:');
    firstPage.drawText(introText, {
      x: leftMargin,
      y: yPosition,
      size: 10,
      font: helvetica,
      color: textBlack,
    });
    yPosition -= 25;

    // =====================================================
    // PRODUCTS TABLE
    // =====================================================

    // Section title
    firstPage.drawText('1. Produse si preturi', {
      x: leftMargin,
      y: yPosition,
      size: 12,
      font: helveticaBold,
      color: primaryBlue,
    });
    yPosition -= 20;

    // Table header
    const tableStartY = yPosition;
    const colWidths = {
      nr: 30,
      product: contentWidth - 180,
      quantity: 70,
      price: 80,
    };

    // Draw table header background
    firstPage.drawRectangle({
      x: leftMargin,
      y: yPosition - 15,
      width: contentWidth,
      height: 20,
      color: rgb(0.9, 0.9, 0.9),
    });

    // Table headers
    let xPos = leftMargin + 5;
    firstPage.drawText('Nr.', { x: xPos, y: yPosition - 10, size: 9, font: helveticaBold, color: textBlack });
    xPos += colWidths.nr;
    firstPage.drawText('Produs', { x: xPos, y: yPosition - 10, size: 9, font: helveticaBold, color: textBlack });
    xPos += colWidths.product;
    firstPage.drawText('Cantitate', { x: xPos, y: yPosition - 10, size: 9, font: helveticaBold, color: textBlack });
    xPos += colWidths.quantity;
    firstPage.drawText('Pret (RON)', { x: xPos, y: yPosition - 10, size: 9, font: helveticaBold, color: textBlack });

    yPosition -= 25;

    // Table rows
    data.items.forEach((item, index) => {
      xPos = leftMargin + 5;

      // Row number
      firstPage.drawText(`${index + 1}.`, {
        x: xPos,
        y: yPosition,
        size: 9,
        font: helvetica,
        color: textBlack
      });
      xPos += colWidths.nr;

      // Product name (truncate if too long)
      const maxProductLength = 45;
      const rawProductName = removeDiacritics(item.productName);
      const productName = rawProductName.length > maxProductLength
        ? rawProductName.substring(0, maxProductLength) + '...'
        : rawProductName;
      firstPage.drawText(productName, {
        x: xPos,
        y: yPosition,
        size: 9,
        font: helvetica,
        color: textBlack
      });
      xPos += colWidths.product;

      // Quantity
      firstPage.drawText(`${item.quantity} ${item.unit}`, {
        x: xPos,
        y: yPosition,
        size: 9,
        font: helvetica,
        color: textBlack
      });
      xPos += colWidths.quantity;

      // Price
      firstPage.drawText(item.finalPrice.toFixed(2), {
        x: xPos,
        y: yPosition,
        size: 9,
        font: helvetica,
        color: textBlack
      });

      yPosition -= 18;

      // Draw row separator
      firstPage.drawLine({
        start: { x: leftMargin, y: yPosition + 5 },
        end: { x: rightMargin, y: yPosition + 5 },
        thickness: 0.5,
        color: rgb(0.8, 0.8, 0.8),
      });
    });

    // Total row
    yPosition -= 5;
    firstPage.drawRectangle({
      x: leftMargin,
      y: yPosition - 10,
      width: contentWidth,
      height: 20,
      color: rgb(0.95, 0.95, 0.95),
    });

    xPos = leftMargin + colWidths.nr + colWidths.product + 5;
    firstPage.drawText('TOTAL:', {
      x: xPos,
      y: yPosition - 5,
      size: 10,
      font: helveticaBold,
      color: textBlack
    });
    xPos += colWidths.quantity;
    firstPage.drawText(`${data.finalTotal.toFixed(2)} RON`, {
      x: xPos,
      y: yPosition - 5,
      size: 10,
      font: helveticaBold,
      color: primaryBlue
    });

    yPosition -= 35;

    // =====================================================
    // TECHNICAL CONDITIONS
    // =====================================================

    // Check if we need a new page
    if (yPosition < 250) {
      const newPage = pdfDoc.addPage([width, height]);
      yPosition = height - 80;
      // Add technical conditions to new page
      this.drawTechnicalConditions(newPage, helvetica, helveticaBold, leftMargin, yPosition, textBlack, primaryBlue);
    } else {
      this.drawTechnicalConditions(firstPage, helvetica, helveticaBold, leftMargin, yPosition, textBlack, primaryBlue);
    }

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  /**
   * Draw technical conditions section
   */
  private drawTechnicalConditions(
    page: any,
    helvetica: any,
    helveticaBold: any,
    leftMargin: number,
    startY: number,
    textBlack: any,
    primaryBlue: any
  ): number {
    let yPosition = startY;
    const lineHeight = 14;
    const sectionGap = 20;

    // Section title
    page.drawText(TECHNICAL_CONDITIONS_RO.title, {
      x: leftMargin,
      y: yPosition,
      size: 12,
      font: helveticaBold,
      color: primaryBlue,
    });
    yPosition -= sectionGap;

    // Intro text (wrap manually)
    const introLines = this.wrapText(TECHNICAL_CONDITIONS_RO.intro, 90);
    introLines.forEach(line => {
      page.drawText(line, {
        x: leftMargin,
        y: yPosition,
        size: 9,
        font: helvetica,
        color: textBlack,
      });
      yPosition -= lineHeight;
    });
    yPosition -= 10;

    // Section 2.1
    page.drawText(TECHNICAL_CONDITIONS_RO.section2_1_title, {
      x: leftMargin,
      y: yPosition,
      size: 10,
      font: helveticaBold,
      color: textBlack,
    });
    yPosition -= lineHeight + 2;

    TECHNICAL_CONDITIONS_RO.section2_1_items.forEach(item => {
      const lines = this.wrapText(`- ${item}`, 95);
      lines.forEach((line, idx) => {
        page.drawText(idx === 0 ? line : `  ${line}`, {
          x: leftMargin,
          y: yPosition,
          size: 9,
          font: helvetica,
          color: textBlack,
        });
        yPosition -= lineHeight;
      });
    });
    yPosition -= 10;

    // Section 2.2
    page.drawText(TECHNICAL_CONDITIONS_RO.section2_2_title, {
      x: leftMargin,
      y: yPosition,
      size: 10,
      font: helveticaBold,
      color: textBlack,
    });
    yPosition -= lineHeight + 2;

    TECHNICAL_CONDITIONS_RO.section2_2_items.forEach(item => {
      page.drawText(`- ${item}`, {
        x: leftMargin,
        y: yPosition,
        size: 9,
        font: helvetica,
        color: textBlack,
      });
      yPosition -= lineHeight;
    });

    return yPosition;
  }

  /**
   * Simple text wrapping helper
   */
  private wrapText(text: string, maxChars: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      if ((currentLine + ' ' + word).trim().length <= maxChars) {
        currentLine = (currentLine + ' ' + word).trim();
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);

    return lines;
  }

  /**
   * Generate PDF without template (fallback)
   */
  private async generateQuotePDFWithoutTemplate(data: QuotePDFData): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size

    const { width, height } = page.getSize();
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const primaryBlue = rgb(0.118, 0.251, 0.686);
    const textBlack = rgb(0, 0, 0);

    let yPosition = height - 50;
    const leftMargin = 50;

    // Header
    page.drawText('METAL DIRECT', {
      x: leftMargin,
      y: yPosition,
      size: 24,
      font: helveticaBold,
      color: primaryBlue,
    });
    yPosition -= 15;

    page.drawText('www.metal-direct.ro', {
      x: leftMargin,
      y: yPosition,
      size: 10,
      font: helvetica,
      color: primaryBlue,
    });
    yPosition -= 40;

    // Title
    page.drawText(removeDiacritics(`OFERTA ${data.referenceNumber}`), {
      x: leftMargin,
      y: yPosition,
      size: 16,
      font: helveticaBold,
      color: textBlack,
    });
    yPosition -= 30;

    // Simple content
    page.drawText(removeDiacritics(`Catre: ${data.companyName}`), {
      x: leftMargin,
      y: yPosition,
      size: 10,
      font: helvetica,
      color: textBlack,
    });
    yPosition -= 15;

    page.drawText(removeDiacritics(`Att: ${data.contactPerson}`), {
      x: leftMargin,
      y: yPosition,
      size: 10,
      font: helvetica,
      color: textBlack,
    });
    yPosition -= 30;

    // Products
    data.items.forEach((item, index) => {
      page.drawText(removeDiacritics(`${index + 1}. ${item.productName} - ${item.quantity} ${item.unit} - ${item.finalPrice.toFixed(2)} RON`), {
        x: leftMargin,
        y: yPosition,
        size: 10,
        font: helvetica,
        color: textBlack,
      });
      yPosition -= 15;
    });

    yPosition -= 15;
    page.drawText(`TOTAL: ${data.finalTotal.toFixed(2)} RON`, {
      x: leftMargin,
      y: yPosition,
      size: 12,
      font: helveticaBold,
      color: primaryBlue,
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }
}

// Export singleton instance
export const pdfService = new PDFService();
