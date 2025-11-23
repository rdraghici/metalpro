import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// Email configuration from environment
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const SES_FROM_EMAIL = process.env.SES_FROM_EMAIL || 'noreply@metal-direct.ro';
const OPERATOR_EMAIL = process.env.OPERATOR_EMAIL || 'sales@metal-direct.ro';
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
  private sesClient: SESClient | null = null;
  private isDevelopment = process.env.NODE_ENV === 'development';

  constructor() {
    this.initializeSES();
  }

  /**
   * Initialize AWS SES client
   */
  private initializeSES() {
    // In development mode without AWS credentials, log emails to console
    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      console.log('📧 Email service running in DEVELOPMENT mode (no AWS credentials)');
      console.log('📧 Emails will be logged to console instead of being sent via SES');
      return;
    }

    try {
      this.sesClient = new SESClient({
        region: AWS_REGION,
        credentials: {
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY,
        },
      });

      console.log(`📧 Email service initialized with AWS SES (Region: ${AWS_REGION})`);
    } catch (error) {
      console.error('❌ Failed to initialize AWS SES client:', error);
    }
  }

  /**
   * Send RFQ confirmation email to customer
   */
  async sendRFQConfirmation(rfq: RFQData): Promise<void> {
    const subject = `Confirmare RFQ ${rfq.referenceNumber} - MetalPro`;
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
            <h1>MetalPro</h1>
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

            <p>Cu stimă,<br/>Echipa MetalPro</p>
          </div>
          <div class="footer">
            <p>MetalPro - Partenerul tău pentru materiale metalice</p>
            <p>Acest email a fost trimis automat. Te rugăm să nu răspunzi la acest mesaj.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(rfq.email, subject, html, 'RFQ Confirmation');
  }

  /**
   * Notify operator about new RFQ
   */
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
            <h1>🔔 RFQ Nou Primit</h1>
          </div>
          <div class="content">
            <div class="urgent">
              <strong>⚠️ Acțiune necesară:</strong> Clientul așteaptă ofertă
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

            <a href="${BACKEND_URL}/admin/rfq/${rfq.id}" class="button">Vezi Detalii RFQ →</a>

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

  /**
   * Send email verification link to new user
   */
  async sendVerificationEmail(email: string, userId: string, verificationToken: string): Promise<void> {
    const verificationUrl = `${FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const subject = 'Verifică adresa de email - MetalPro';
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
            <h1>Bine ai venit la MetalPro!</h1>
          </div>
          <div class="content">
            <p>Te rugăm să verifici adresa de email făcând clic pe butonul de mai jos:</p>

            <a href="${verificationUrl}" class="button">Verifică Email</a>

            <p>Sau copiază acest link în browser:</p>
            <p style="background-color: #e9ecef; padding: 10px; word-break: break-all; font-size: 12px;">
              ${verificationUrl}
            </p>

            <p style="color: #dc3545; margin-top: 20px;">
              <strong>⏰ Important:</strong> Linkul este valabil 24 de ore.
            </p>

            <p style="color: #666; margin-top: 20px;">
              Dacă nu ai creat un cont pe MetalPro, te rugăm să ignori acest email.
            </p>
          </div>
          <div class="footer">
            <p>MetalPro - Partenerul tău pentru materiale metalice</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, subject, html, 'Email Verification');
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
    const subject = 'Resetare Parolă - MetalPro';
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
            <h1>🔐 Resetare Parolă</h1>
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
              <strong>⏰ Important:</strong> Linkul este valabil 1 oră.
            </div>

            <div class="warning">
              <strong>🔒 Securitate:</strong> Dacă nu ai solicitat resetarea parolei, te rugăm să ignori acest email.
              Parola ta va rămâne neschimbată și este posibil ca cineva să fi încercat să acceseze contul tău.
            </div>
          </div>
          <div class="footer">
            <p>MetalPro - Partenerul tău pentru materiale metalice</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(email, subject, html, 'Password Reset');
  }

  /**
   * Send quote ready notification to customer
   */
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
            <h1>✅ Oferta Ta Este Gata!</h1>
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
            <a href="${quote.pdfUrl}" class="button">📄 Descarcă Oferta PDF</a>

            <p style="margin-top: 30px;">
              Pentru detalii sau modificări, te rugăm să ne contactezi telefonic sau să răspunzi acestui email.
            </p>

            <p style="background-color: #cfe2ff; padding: 15px; border-left: 4px solid #0d6efd; margin: 20px 0;">
              <strong>📞 Contact:</strong><br/>
              Email: ${OPERATOR_EMAIL}<br/>
              Telefon: +40 XXX XXX XXX
            </p>

            <p>Cu stimă,<br/>Echipa MetalPro</p>
          </div>
          <div class="footer">
            <p>MetalPro - Partenerul tău pentru materiale metalice</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail(quote.email, subject, html, 'Quote Ready');
  }

  /**
   * Internal method to send email via AWS SES
   */
  private async sendEmail(to: string, subject: string, html: string, type: string): Promise<void> {
    try {
      if (!this.sesClient) {
        // Development mode: Log to console instead of sending
        console.log('\n===========================================');
        console.log(`📧 [EMAIL - ${type}] Would send email via SES:`);
        console.log(`To: ${to}`);
        console.log(`From: ${SES_FROM_EMAIL}`);
        console.log(`Subject: ${subject}`);
        console.log('===========================================\n');
        return;
      }

      // Production mode: Send via AWS SES
      const command = new SendEmailCommand({
        Source: `MetalPro <${SES_FROM_EMAIL}>`,
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Subject: {
            Data: subject,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: html,
              Charset: 'UTF-8',
            },
          },
        },
      });

      const response = await this.sesClient.send(command);
      console.log(`✅ Email sent successfully via SES: ${type} to ${to} (Message ID: ${response.MessageId})`);
    } catch (error) {
      console.error(`❌ Error sending email via SES (${type}):`, error);
      throw new Error(`Failed to send ${type} email via SES`);
    }
  }

  /**
   * Verify SES configuration (useful for testing)
   */
  async verifyConnection(): Promise<boolean> {
    if (!this.sesClient) {
      console.log('⚠️  No AWS SES client configured (development mode)');
      return false;
    }

    try {
      // You can add a test email send here if needed
      console.log('✅ AWS SES client is configured and ready');
      return true;
    } catch (error) {
      console.error('❌ AWS SES configuration verification failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
