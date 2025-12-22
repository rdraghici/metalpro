import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// Email configuration from environment
const ZOHO_SMTP_HOST = process.env.ZOHO_SMTP_HOST || 'smtp.zoho.eu';
const ZOHO_SMTP_PORT = parseInt(process.env.ZOHO_SMTP_PORT || '465');
const ZOHO_MAIL_USER = process.env.ZOHO_MAIL_USER || 'no-reply@metal-direct.ro';
const ZOHO_MAIL_PASSWORD = process.env.ZOHO_MAIL_PASSWORD;
const OPERATOR_EMAIL = process.env.ZOHO_OPERATOR_EMAIL || 'sales@metal-direct.ro';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

interface RFQData {
  id: string;
  referenceNumber: string;
  companyName: string;
  cui?: string;
  contactPerson: string;
  email: string;
  phone: string;
  estimatedTotal?: number;
  deliveryDate?: string;
}

interface QuoteData {
  referenceNumber: string;
  contactPerson: string;
  email: string;
  finalQuoteAmount: number;
  pdfUrl: string;
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

  async sendRFQConfirmation(rfq: RFQData): Promise<void> {
    const subject = `Confirmare RFQ ${rfq.referenceNumber} - Metal Direct`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #0066cc; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .details { background-color: white; padding: 15px; margin: 20px 0; border-left: 4px solid #0066cc; }
          .button { background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none;
                    border-radius: 4px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Metal Direct</h1>
          </div>
          <div class="content">
            <h2>Cerere Ofertă Primită</h2>
            <p>Bună ${rfq.contactPerson},</p>
            <p>Am primit cererea ta de ofertă cu referința <strong>${rfq.referenceNumber}</strong>.</p>
            <p>Echipa noastră de vânzări va analiza solicitarea și va reveni cu o ofertă detaliată în cel mai scurt timp.</p>

            <div class="details">
              <h3>Detalii Comandă:</h3>
              <ul>
                <li><strong>Companie:</strong> ${rfq.companyName}</li>
                ${rfq.cui ? `<li><strong>CUI:</strong> ${rfq.cui}</li>` : ''}
                <li><strong>Total estimat:</strong> ${rfq.estimatedTotal ? `${rfq.estimatedTotal.toFixed(2)} RON` : 'Se calculează'}</li>
                <li><strong>Data dorită livrare:</strong> ${rfq.deliveryDate || 'Nu a fost specificată'}</li>
              </ul>
            </div>

            <p>Poți urmări statusul comenzii în contul tău:</p>
            <a href="${FRONTEND_URL}/account/orders" class="button">Vezi Istoric Comenzi</a>

            <p>Cu stimă,<br/>Echipa Metal Direct</p>
          </div>
          <div class="footer">
            <p>Metal Direct - Partenerul tău pentru materiale metalice</p>
            <p>Acest email a fost trimis automat. Te rugăm să nu răspunzi la acest mesaj.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(rfq.email, subject, html, 'RFQ Confirmation');
  }

  async notifyOperatorNewRFQ(rfq: RFQData): Promise<void> {
    const subject = `[NOU RFQ] ${rfq.referenceNumber} - ${rfq.companyName}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .details { background-color: white; padding: 15px; margin: 20px 0; border-left: 4px solid #28a745; }
          .button { background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none;
                    border-radius: 4px; display: inline-block; margin: 20px 0; }
          .urgent { background-color: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>RFQ Nou Primit</h1>
          </div>
          <div class="content">
            <div class="urgent">
              <strong>Actiune necesară:</strong> Clientul așteaptă ofertă
            </div>

            <div class="details">
              <h3>Informații Client:</h3>
              <ul>
                <li><strong>Referință RFQ:</strong> ${rfq.referenceNumber}</li>
                <li><strong>Companie:</strong> ${rfq.companyName}</li>
                ${rfq.cui ? `<li><strong>CUI:</strong> ${rfq.cui}</li>` : ''}
                <li><strong>Persoană contact:</strong> ${rfq.contactPerson}</li>
                <li><strong>Email:</strong> <a href="mailto:${rfq.email}">${rfq.email}</a></li>
                <li><strong>Telefon:</strong> <a href="tel:${rfq.phone}">${rfq.phone}</a></li>
              </ul>

              <h3>Detalii Comandă:</h3>
              <ul>
                <li><strong>Total estimat:</strong> ${rfq.estimatedTotal ? `${rfq.estimatedTotal.toFixed(2)} RON` : 'Se calculează'}</li>
                <li><strong>Data livrare dorită:</strong> ${rfq.deliveryDate || 'Nu a fost specificată'}</li>
              </ul>
            </div>

            <a href="${BACKEND_URL}/admin/rfq/${rfq.id}" class="button">Vezi Detalii RFQ</a>

            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              Timpul mediu de răspuns așteptat: 2-4 ore în timpul programului de lucru
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(OPERATOR_EMAIL, subject, html, 'Operator Notification');
  }

  async sendVerificationEmail(email: string, userId: string, verificationToken: string): Promise<void> {
    const verificationUrl = `${FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const subject = 'Verifică adresa de email - Metal Direct';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #0066cc; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none;
                    border-radius: 4px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bine ai venit la Metal Direct!</h1>
          </div>
          <div class="content">
            <p>Te rugăm să verifici adresa de email făcând clic pe butonul de mai jos:</p>

            <a href="${verificationUrl}" class="button">Verifică Email</a>

            <p>Sau copiază acest link în browser:</p>
            <p style="background-color: #e9ecef; padding: 10px; word-break: break-all; font-size: 12px;">
              ${verificationUrl}
            </p>

            <p style="color: #dc3545; margin-top: 20px;">
              <strong>Important:</strong> Linkul este valabil 24 de ore.
            </p>

            <p style="color: #666; margin-top: 20px;">
              Dacă nu ai creat un cont pe Metal Direct, te rugăm să ignori acest email.
            </p>
          </div>
          <div class="footer">
            <p>Metal Direct - Partenerul tău pentru materiale metalice</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, subject, html, 'Email Verification');
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
    const subject = 'Resetare Parolă - Metal Direct';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none;
                    border-radius: 4px; display: inline-block; margin: 20px 0; }
          .warning { background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Resetare Parolă</h1>
          </div>
          <div class="content">
            <p>Am primit o solicitare de resetare a parolei pentru contul tău.</p>
            <p>Dacă tu ai făcut această solicitare, fă clic pe butonul de mai jos pentru a seta o parolă nouă:</p>

            <a href="${resetUrl}" class="button">Resetează Parola</a>

            <p>Sau copiază acest link în browser:</p>
            <p style="background-color: #e9ecef; padding: 10px; word-break: break-all; font-size: 12px;">
              ${resetUrl}
            </p>

            <div class="warning">
              <strong>Important:</strong> Linkul este valabil 1 oră.
            </div>

            <div class="warning">
              <strong>Securitate:</strong> Dacă nu ai solicitat resetarea parolei, te rugăm să ignori acest email.
              Parola ta va rămâne neschimbată.
            </div>
          </div>
          <div class="footer">
            <p>Metal Direct - Partenerul tău pentru materiale metalice</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, subject, html, 'Password Reset');
  }

  async sendRFQAcknowledgment(rfq: RFQData): Promise<void> {
    const subject = `RFQ ${rfq.referenceNumber} în Lucru - Metal Direct`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #0066cc; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .status-box { background-color: #cfe2ff; border-left: 4px solid #0d6efd; padding: 15px; margin: 20px 0; }
          .button { background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none;
                    border-radius: 4px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>RFQ Confirmat</h1>
          </div>
          <div class="content">
            <p>Bună ${rfq.contactPerson},</p>
            <p>Îți confirmăm că am primit și procesat cererea ta de ofertă cu referința <strong>${rfq.referenceNumber}</strong>.</p>

            <div class="status-box">
              <strong>Status:</strong> În lucru<br/>
              <strong>Timp estimat:</strong> 24-48 ore<br/>
              <strong>Referință:</strong> ${rfq.referenceNumber}
            </div>

            <p>Echipa noastră de specialiști analizează în detaliu cererea ta și pregătește o ofertă personalizată.
            Vei primi notificare automată când oferta va fi gata.</p>

            <p>Poți urmări statusul comenzii în contul tău:</p>
            <a href="${FRONTEND_URL}/account/orders" class="button">Vezi Statusul Comenzii</a>

            <p style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
              <strong>Întrebări?</strong><br/>
              Pentru clarificări sau modificări, ne poți contacta la:<br/>
              Email: ${OPERATOR_EMAIL}
            </p>

            <p>Cu stimă,<br/>Echipa Metal Direct</p>
          </div>
          <div class="footer">
            <p>Metal Direct - Partenerul tău pentru materiale metalice</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(rfq.email, subject, html, 'RFQ Acknowledgment');
  }

  async sendQuoteReady(quote: QuoteData): Promise<void> {
    const subject = `Ofertă Pregătită - ${quote.referenceNumber}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .price-box { background-color: #d4edda; border: 2px solid #28a745; padding: 20px;
                       text-align: center; margin: 20px 0; border-radius: 8px; }
          .button { background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none;
                    border-radius: 4px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Oferta Ta Este Gata!</h1>
          </div>
          <div class="content">
            <p>Bună ${quote.contactPerson},</p>
            <p>Am pregătit oferta pentru cererea ta cu referința <strong>${quote.referenceNumber}</strong>.</p>

            <div class="price-box">
              <h2 style="margin: 0; color: #28a745;">Valoare Totală</h2>
              <p style="font-size: 32px; font-weight: bold; margin: 10px 0; color: #155724;">
                ${quote.finalQuoteAmount.toFixed(2)} RON
              </p>
              <p style="margin: 0; font-size: 14px; color: #666;">(inclusiv TVA)</p>
            </div>

            <p>Descarcă oferta detaliată:</p>
            <a href="${quote.pdfUrl}" class="button">Descarcă Oferta PDF</a>

            <p style="margin-top: 30px;">
              Pentru detalii sau modificări, te rugăm să ne contactezi telefonic sau să răspunzi acestui email.
            </p>

            <p style="background-color: #cfe2ff; padding: 15px; border-left: 4px solid #0d6efd; margin: 20px 0;">
              <strong>Contact:</strong><br/>
              Email: ${OPERATOR_EMAIL}<br/>
              Telefon: +40 XXX XXX XXX
            </p>

            <p>Cu stimă,<br/>Echipa Metal Direct</p>
          </div>
          <div class="footer">
            <p>Metal Direct - Partenerul tău pentru materiale metalice</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(quote.email, subject, html, 'Quote Ready');
  }

  private async sendEmail(to: string, subject: string, html: string, type: string): Promise<void> {
    try {
      if (!this.transporter) {
        console.log('\n===========================================');
        console.log(`📧 [EMAIL - ${type}] Would send email via Zoho:`);
        console.log(`To: ${to}`);
        console.log(`From: ${ZOHO_MAIL_USER}`);
        console.log(`Subject: ${subject}`);
        console.log('===========================================\n');
        return;
      }

      const info = await this.transporter.sendMail({
        from: `Metal Direct <${ZOHO_MAIL_USER}>`,
        to: to,
        subject: subject,
        html: html,
      });

      console.log(`✅ Email sent via Zoho: ${type} to ${to} (ID: ${info.messageId})`);
    } catch (error) {
      console.error(`❌ Error sending email (${type}):`, error);
      throw new Error(`Failed to send ${type} email`);
    }
  }

  async verifyConnection(): Promise<boolean> {
    if (!this.transporter) {
      console.log('⚠️ No Zoho SMTP transporter configured (development mode)');
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('✅ Zoho SMTP connection verified');
      return true;
    } catch (error) {
      console.error('❌ Zoho SMTP verification failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
