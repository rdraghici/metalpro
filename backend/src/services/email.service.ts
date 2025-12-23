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
}

interface RFQQuotedData {
  referenceNumber: string;
  customerEmail: string;
  contactPerson: string;
  companyName: string;
  items: RFQItem[];
  finalTotal: number;
}

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
    const itemsHtml = data.items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.productName}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity} ${item.unit}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${item.grossPrice.toFixed(2)} RON</td>
      </tr>
    `).join('');

    const subject = `Confirmare cerere ofertă ${data.referenceNumber} - Metal Direct`;
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
            <p>Bună ${data.contactPerson},</p>
            <p>Am primit cererea ta de ofertă cu numărul <strong>${data.referenceNumber}</strong>.</p>
            <p>Echipa noastră va analiza solicitarea și va reveni cu o ofertă în cel mai scurt timp.</p>

            <h3 style="margin-top: 20px; border-bottom: 2px solid #1e40af; padding-bottom: 5px;">Produse solicitate:</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr style="background-color: #e5e7eb;">
                  <th style="padding: 8px; text-align: left;">Produs</th>
                  <th style="padding: 8px; text-align: center;">Cantitate</th>
                  <th style="padding: 8px; text-align: right;">Preț estimat</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="margin-top: 20px; padding: 15px; background-color: #dbeafe; border-left: 4px solid #1e40af;">
              <strong>Total estimat: ${data.estimatedTotal.toFixed(2)} RON</strong>
            </div>

            <p style="margin-top: 20px;">Cu stimă,<br/>Echipa Metal Direct</p>
          </div>

          <div style="text-align: center; padding: 15px; color: #666; font-size: 12px;">
            <p>Metal Direct - Partenerul tău pentru materiale metalice</p>
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

    const subject = `Oferta ${data.referenceNumber} este gata - Metal Direct`;
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
            <p>Bună ${data.contactPerson},</p>
            <p>Oferta pentru cererea <strong>${data.referenceNumber}</strong> este gata!</p>

            <h3 style="margin-top: 20px; border-bottom: 2px solid #166534; padding-bottom: 5px;">Detalii ofertă:</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr style="background-color: #e5e7eb;">
                  <th style="padding: 8px; text-align: left;">Produs</th>
                  <th style="padding: 8px; text-align: center;">Cantitate</th>
                  <th style="padding: 8px; text-align: right;">Preț final</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="margin-top: 20px; padding: 15px; background-color: #dcfce7; border-left: 4px solid #166534;">
              <strong style="font-size: 18px;">Total: ${data.finalTotal.toFixed(2)} RON</strong>
            </div>

            <p style="margin-top: 20px;"><strong>📎 Atașat găsiți oferta în format PDF.</strong></p>
            <p>Pentru întrebări sau pentru a confirma comanda, te rugăm să ne contactezi.</p>
            <p>Cu stimă,<br/>Echipa Metal Direct</p>
          </div>

          <div style="text-align: center; padding: 15px; color: #666; font-size: 12px;">
            <p>Metal Direct - Partenerul tău pentru materiale metalice</p>
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
