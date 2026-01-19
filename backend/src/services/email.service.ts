import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { pdfService } from './pdf.service';

const ZOHO_SMTP_HOST = process.env.ZOHO_SMTP_HOST || 'smtp.zoho.eu';
const ZOHO_SMTP_PORT = parseInt(process.env.ZOHO_SMTP_PORT || '465');
const ZOHO_MAIL_USER = process.env.ZOHO_MAIL_USER || 'sales@metal-direct.ro';
const ZOHO_MAIL_PASSWORD = process.env.ZOHO_MAIL_PASSWORD;

interface RFQItem {
  productSku: string;
  productName: string;
  quantity: number;
  unit: string;
  grossPrice: number;
  finalPrice?: number;
}

interface RFQSubmittedData {
  referenceNumber: string;
  customerEmail: string;
  contactPerson: string;
  companyName: string;
  items: RFQItem[];
  estimatedTotal: number;
  language?: 'ro' | 'en';
}

interface RFQQuotedData {
  referenceNumber: string;
  customerEmail: string;
  contactPerson: string;
  companyName: string;
  items: RFQItem[];
  finalTotal: number;
  language?: 'ro' | 'en';
}

// Email translations
const EMAIL_TRANSLATIONS = {
  ro: {
    submitted: {
      subject: (ref: string) => `Confirmare cerere ofertă ${ref} - Metal Direct`,
      greeting: (name: string) => `Bună ${name},`,
      received: (ref: string) => `Am primit cererea ta de ofertă cu numărul <strong>${ref}</strong>.`,
      processing: 'Echipa noastră va analiza solicitarea și va reveni cu o ofertă în cel mai scurt timp.',
      productsTitle: 'Produse solicitate:',
      tableProduct: 'Produs',
      tableQuantity: 'Cantitate',
      tablePrice: 'Preț estimat',
      estimatedTotal: 'Total estimat:',
      regards: 'Cu stimă,',
      team: 'Echipa Metal Direct',
      footer: 'Metal Direct - Partenerul tău pentru materiale metalice',
    },
    quoted: {
      subject: (ref: string) => `Oferta ${ref} este gata - Metal Direct`,
      greeting: (name: string) => `Bună ${name},`,
      ready: (ref: string) => `Oferta pentru cererea <strong>${ref}</strong> este gata!`,
      detailsTitle: 'Detalii ofertă:',
      tableProduct: 'Produs',
      tableQuantity: 'Cantitate',
      tablePrice: 'Preț final',
      total: 'Total:',
      attachment: '📎 Atașat găsiți oferta în format PDF.',
      contact: 'Pentru întrebări sau pentru a confirma comanda, te rugăm să ne contactezi.',
      regards: 'Cu stimă,',
      team: 'Echipa Metal Direct',
      footer: 'Metal Direct - Partenerul tău pentru materiale metalice',
    },
  },
  en: {
    submitted: {
      subject: (ref: string) => `Quote Request Confirmation ${ref} - Metal Direct`,
      greeting: (name: string) => `Hello ${name},`,
      received: (ref: string) => `We have received your quote request with reference number <strong>${ref}</strong>.`,
      processing: 'Our team will analyze your request and get back to you with a quote as soon as possible.',
      productsTitle: 'Requested products:',
      tableProduct: 'Product',
      tableQuantity: 'Quantity',
      tablePrice: 'Estimated price',
      estimatedTotal: 'Estimated total:',
      regards: 'Best regards,',
      team: 'The Metal Direct Team',
      footer: 'Metal Direct - Your partner for metal materials',
    },
    quoted: {
      subject: (ref: string) => `Quote ${ref} is ready - Metal Direct`,
      greeting: (name: string) => `Hello ${name},`,
      ready: (ref: string) => `The quote for request <strong>${ref}</strong> is ready!`,
      detailsTitle: 'Quote details:',
      tableProduct: 'Product',
      tableQuantity: 'Quantity',
      tablePrice: 'Final price',
      total: 'Total:',
      attachment: '📎 Please find the quote attached as a PDF.',
      contact: 'For questions or to confirm the order, please contact us.',
      regards: 'Best regards,',
      team: 'The Metal Direct Team',
      footer: 'Metal Direct - Your partner for metal materials',
    },
  },
};

export class EmailService {
  private transporter: Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    if (!ZOHO_MAIL_PASSWORD) {
      console.log('📧 Email service running in DEVELOPMENT mode (no Zoho credentials)');
      console.log('📧 Emails will be logged to console instead of being sent');
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: ZOHO_SMTP_HOST,
        port: ZOHO_SMTP_PORT,
        secure: true,
        auth: {
          user: ZOHO_MAIL_USER,
          pass: ZOHO_MAIL_PASSWORD,
        },
      });
      console.log(`📧 Email service initialized with Zoho SMTP (${ZOHO_SMTP_HOST})`);
    } catch (error) {
      console.error('❌ Failed to initialize Zoho SMTP transporter:', error);
    }
  }

  /**
   * Email 1: Sent when RFQ is submitted by customer
   */
  async sendRFQSubmittedEmail(data: RFQSubmittedData): Promise<void> {
    const lang = data.language || 'ro';
    const t = EMAIL_TRANSLATIONS[lang].submitted;

    const itemsHtml = data.items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.productName}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity} ${item.unit}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${item.grossPrice.toFixed(2)} RON</td>
      </tr>
    `).join('');

    const subject = t.subject(data.referenceNumber);
    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Metal Direct</h1>
          </div>

          <div style="padding: 20px; background-color: #f9f9f9;">
            <p>${t.greeting(data.contactPerson)}</p>
            <p>${t.received(data.referenceNumber)}</p>
            <p>${t.processing}</p>

            <h3 style="margin-top: 20px; border-bottom: 2px solid #1e40af; padding-bottom: 5px;">${t.productsTitle}</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr style="background-color: #e5e7eb;">
                  <th style="padding: 8px; text-align: left;">${t.tableProduct}</th>
                  <th style="padding: 8px; text-align: center;">${t.tableQuantity}</th>
                  <th style="padding: 8px; text-align: right;">${t.tablePrice}</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="margin-top: 20px; padding: 15px; background-color: #dbeafe; border-left: 4px solid #1e40af;">
              <strong>${t.estimatedTotal} ${data.estimatedTotal.toFixed(2)} RON</strong>
            </div>

            <p style="margin-top: 20px;">${t.regards}<br/>${t.team}</p>
          </div>

          <div style="text-align: center; padding: 15px; color: #666; font-size: 12px;">
            <p>${t.footer}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(data.customerEmail, subject, html, 'RFQ Submitted');
  }

  /**
   * Email 2: Sent when RFQ status changes to QUOTED in backoffice
   * Includes PDF attachment with the formal quote
   */
  async sendRFQQuotedEmail(data: RFQQuotedData): Promise<void> {
    const lang = data.language || 'ro';
    console.log('🌍 sendRFQQuotedEmail language debug:', {
      receivedLanguage: data.language,
      resolvedLang: lang,
    });
    const t = EMAIL_TRANSLATIONS[lang].quoted;

    const itemsHtml = data.items.map(item => {
      const price = item.finalPrice ?? item.grossPrice;
      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.productName}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity} ${item.unit}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${price.toFixed(2)} RON</td>
        </tr>
      `;
    }).join('');

    const subject = t.subject(data.referenceNumber);
    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto;">
          <div style="background-color: #166534; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Metal Direct</h1>
          </div>

          <div style="padding: 20px; background-color: #f9f9f9;">
            <p>${t.greeting(data.contactPerson)}</p>
            <p>${t.ready(data.referenceNumber)}</p>

            <h3 style="margin-top: 20px; border-bottom: 2px solid #166534; padding-bottom: 5px;">${t.detailsTitle}</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr style="background-color: #e5e7eb;">
                  <th style="padding: 8px; text-align: left;">${t.tableProduct}</th>
                  <th style="padding: 8px; text-align: center;">${t.tableQuantity}</th>
                  <th style="padding: 8px; text-align: right;">${t.tablePrice}</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="margin-top: 20px; padding: 15px; background-color: #dcfce7; border-left: 4px solid #166534;">
              <strong style="font-size: 18px;">${t.total} ${data.finalTotal.toFixed(2)} RON</strong>
            </div>

            <p style="margin-top: 20px;"><strong>${t.attachment}</strong></p>
            <p>${t.contact}</p>
            <p>${t.regards}<br/>${t.team}</p>
          </div>

          <div style="text-align: center; padding: 15px; color: #666; font-size: 12px;">
            <p>${t.footer}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Generate PDF attachment
    let pdfBuffer: Buffer | null = null;
    try {
      pdfBuffer = await pdfService.generateQuotePDF({
        referenceNumber: data.referenceNumber,
        companyName: data.companyName,
        contactPerson: data.contactPerson,
        items: data.items.map(item => ({
          productName: item.productName,
          quantity: item.quantity,
          unit: item.unit,
          finalPrice: item.finalPrice ?? item.grossPrice,
        })),
        finalTotal: data.finalTotal,
        quoteDate: new Date(),
        language: lang,
      });
      console.log(`📄 PDF generated for ${data.referenceNumber}`);
    } catch (pdfError) {
      console.error('❌ Failed to generate PDF:', pdfError);
      // Continue without PDF attachment
    }

    await this.sendEmailWithAttachment(
      data.customerEmail,
      subject,
      html,
      'RFQ Quoted',
      pdfBuffer ? [{
        filename: `${data.referenceNumber}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      }] : []
    );
  }

  private async sendEmail(to: string, subject: string, html: string, type: string): Promise<void> {
    await this.sendEmailWithAttachment(to, subject, html, type, []);
  }

  private async sendEmailWithAttachment(
    to: string,
    subject: string,
    html: string,
    type: string,
    attachments: Array<{ filename: string; content: Buffer; contentType: string }>
  ): Promise<void> {
    try {
      if (!this.transporter) {
        console.log('\n===========================================');
        console.log(`📧 [EMAIL - ${type}]`);
        console.log(`To: ${to}`);
        console.log(`From: ${ZOHO_MAIL_USER}`);
        console.log(`Subject: ${subject}`);
        if (attachments.length > 0) {
          console.log(`Attachments: ${attachments.map(a => a.filename).join(', ')}`);
        }
        console.log('===========================================\n');
        return;
      }

      const info = await this.transporter.sendMail({
        from: `Metal Direct <${ZOHO_MAIL_USER}>`,
        to: to,
        subject: subject,
        html: html,
        attachments: attachments.map(att => ({
          filename: att.filename,
          content: att.content,
          contentType: att.contentType,
        })),
      });

      console.log(`✅ Email sent: ${type} to ${to} (ID: ${info.messageId})${attachments.length > 0 ? ` with ${attachments.length} attachment(s)` : ''}`);
    } catch (error) {
      console.error(`❌ Error sending email (${type}):`, error);
      throw new Error(`Failed to send ${type} email`);
    }
  }
}

export const emailService = new EmailService();
