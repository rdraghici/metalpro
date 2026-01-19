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
  language?: 'ro' | 'en';
}

// =====================================================
// PDF TRANSLATIONS
// =====================================================

const PDF_TRANSLATIONS = {
  ro: {
    quoteTitle: (ref: string) => removeDiacritics(`OFERTA ${ref}`),
    date: 'Data:',
    to: 'Catre:',
    attention: 'Att:',
    intro: removeDiacritics('In urma cererii dumneavoastra, va transmitem oferta noastra:'),
    productsTitle: '1. Produse si preturi',
    tableNr: 'Nr.',
    tableProduct: 'Produs',
    tableQuantity: 'Cantitate',
    tablePrice: 'Pret (RON)',
    total: 'TOTAL:',
    technicalConditions: {
      title: removeDiacritics('2. Conditii tehnice'),
      sections: [
        {
          title: removeDiacritics('2.1 Domeniu & standarde'),
          text: removeDiacritics('Materie prima pentru proiecte B2B. Orientativ: EN 10025-2 (S235JR/S355JR), EN 10365 (HEA/HEB/IPE/UNP), EN 10034 (tolerante grinzi), EN 10219/10210 (tevi), EN 10130/10025 (tabla), EN 10088 (inox), EN AW (Al).'),
        },
        {
          title: removeDiacritics('2.2 Tolerante & suprafata'),
          text: removeDiacritics('Greutatile sunt teoretice (p~7,85 t/m3); abateri conforme standardelor. Lungimi comerciale; debitari la cerere (uzual +/-2-3 mm mecanic; taieri termice au tolerante specifice). Urmele de laminare/formare sunt normale.'),
        },
        {
          title: removeDiacritics('2.3 Certificare & trasabilitate'),
          text: removeDiacritics('La cerere/unde se aplica: EN 10204 - 3.1 per lot (heat/batch); marcajele de pachet se mentin pana la receptie.'),
        },
        {
          title: removeDiacritics('2.4 Livrare & receptie'),
          text: removeDiacritics('Conform ofertei (Incoterms, termene, unitati: kg/m, kg/buc, m2). Receptie cantitativa/calitativa la descarcare; deteriorarile vizibile se consemneaza pe documentul de transport. Posibile livrari partiale.'),
        },
        {
          title: removeDiacritics('2.5 Limitari'),
          text: removeDiacritics('Datele tehnice sunt orientative; pot exista variatii in limitele standardelor sau intre furnizori. Proiectarea/montajul revin beneficiarului; Metal-Direct nu garanteaza performanta structurala in utilizare.'),
        },
      ],
    },
  },
  en: {
    quoteTitle: (ref: string) => `QUOTE ${ref}`,
    date: 'Date:',
    to: 'To:',
    attention: 'Att:',
    intro: 'Following your request, please find our quote below:',
    productsTitle: '1. Products and prices',
    tableNr: 'No.',
    tableProduct: 'Product',
    tableQuantity: 'Quantity',
    tablePrice: 'Price (RON)',
    total: 'TOTAL:',
    technicalConditions: {
      title: '2. Technical conditions',
      sections: [
        {
          title: '2.1 Scope & standards',
          text: 'Raw materials for B2B projects. Reference: EN 10025-2 (S235JR/S355JR), EN 10365 (HEA/HEB/IPE/UNP), EN 10034 (beam tolerances), EN 10219/10210 (pipes), EN 10130/10025 (sheets), EN 10088 (stainless), EN AW (Al).',
        },
        {
          title: '2.2 Tolerances & surface',
          text: 'Weights are theoretical (p~7.85 t/m3); deviations per standards. Commercial lengths; cutting on request (typically +/-2-3 mm mechanical; thermal cuts have specific tolerances). Rolling/forming marks are normal.',
        },
        {
          title: '2.3 Certification & traceability',
          text: 'On request/where applicable: EN 10204 - 3.1 per lot (heat/batch); package markings maintained until reception.',
        },
        {
          title: '2.4 Delivery & reception',
          text: 'Per quote (Incoterms, deadlines, units: kg/m, kg/pcs, m2). Quantitative/qualitative reception at unloading; visible damage noted on transport document. Partial deliveries possible.',
        },
        {
          title: '2.5 Limitations',
          text: 'Technical data is indicative; variations within standard limits or between suppliers may occur. Design/installation is the responsibility of the buyer; Metal-Direct does not guarantee structural performance in use.',
        },
      ],
    },
  },
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
    const lang = data.language || 'ro';
    const t = PDF_TRANSLATIONS[lang];

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

    firstPage.drawText(t.quoteTitle(data.referenceNumber), {
      x: leftMargin,
      y: yPosition,
      size: 18,
      font: helveticaBold,
      color: primaryBlue,
    });
    yPosition -= 30;

    // Date
    const dateLocale = lang === 'en' ? 'en-GB' : 'ro-RO';
    const formattedDate = data.quoteDate.toLocaleDateString(dateLocale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    firstPage.drawText(`${t.date} ${formattedDate}`, {
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

    firstPage.drawText(t.to, {
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

    firstPage.drawText(removeDiacritics(`${t.attention} ${data.contactPerson}`), {
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

    firstPage.drawText(t.intro, {
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
    firstPage.drawText(t.productsTitle, {
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
    firstPage.drawText(t.tableNr, { x: xPos, y: yPosition - 10, size: 9, font: helveticaBold, color: textBlack });
    xPos += colWidths.nr;
    firstPage.drawText(t.tableProduct, { x: xPos, y: yPosition - 10, size: 9, font: helveticaBold, color: textBlack });
    xPos += colWidths.product;
    firstPage.drawText(t.tableQuantity, { x: xPos, y: yPosition - 10, size: 9, font: helveticaBold, color: textBlack });
    xPos += colWidths.quantity;
    firstPage.drawText(t.tablePrice, { x: xPos, y: yPosition - 10, size: 9, font: helveticaBold, color: textBlack });

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
    firstPage.drawText(t.total, {
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
      this.drawTechnicalConditions(newPage, helvetica, helveticaBold, leftMargin, yPosition, textBlack, primaryBlue, t.technicalConditions);
    } else {
      this.drawTechnicalConditions(firstPage, helvetica, helveticaBold, leftMargin, yPosition, textBlack, primaryBlue, t.technicalConditions);
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
    primaryBlue: any,
    conditions: { title: string; sections: Array<{ title: string; text: string }> }
  ): number {
    let yPosition = startY;
    const lineHeight = 12;
    const sectionGap = 16;

    // Main title
    page.drawText(conditions.title, {
      x: leftMargin,
      y: yPosition,
      size: 11,
      font: helveticaBold,
      color: primaryBlue,
    });
    yPosition -= sectionGap;

    // Draw each section
    conditions.sections.forEach((section) => {
      // Section title
      page.drawText(section.title, {
        x: leftMargin,
        y: yPosition,
        size: 9,
        font: helveticaBold,
        color: textBlack,
      });
      yPosition -= lineHeight;

      // Section text (wrap)
      const lines = this.wrapText(section.text, 95);
      lines.forEach((line) => {
        page.drawText(line, {
          x: leftMargin,
          y: yPosition,
          size: 8,
          font: helvetica,
          color: textBlack,
        });
        yPosition -= lineHeight - 2;
      });
      yPosition -= 6;
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
