# Zoho Mail Integration Guide

## Overview

Since AWS SES production access was denied, we're migrating to **Zoho Mail** for transactional emails. This document outlines the available integration approaches and our recommended solution.

---

## Current Setup

### Zoho Mail Accounts
| Address | Purpose | Password |
|---------|---------|----------|
| `no-reply@metal-direct.ro` | Transactional emails (RFQ confirmations, verification, password reset) | `Salmonella@18` |
| `sales@metal-direct.ro` | Operator notifications | `Salmonella@18` |
| `admin@metal-direct.ro` | Admin notifications | (reserved for admin use) |

### Current Email Service
The existing `email.service.ts` uses AWS SES with the `@aws-sdk/client-ses` package. We need to replace the SES client with a Zoho-compatible solution.

---

## Integration Options

### Option 1: Nodemailer with Zoho SMTP (RECOMMENDED)

**Pros:**
- Simple, battle-tested library (30M+ weekly downloads)
- No Zoho API setup required
- Works immediately with existing Zoho Mail accounts
- Zero additional cost
- Easy to switch to other SMTP providers if needed

**Cons:**
- Rate limits based on Zoho Mail plan (may be lower than dedicated transactional service)
- Less detailed analytics than dedicated services

**Implementation:**
```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.eu',  // EU datacenter
  port: 465,
  secure: true,
  auth: {
    user: 'no-reply@metal-direct.ro',
    pass: process.env.ZOHO_MAIL_PASSWORD,
  },
});
```

**SMTP Settings:**
| Region | Host | Port (SSL) | Port (TLS) |
|--------|------|------------|------------|
| US | smtp.zoho.com | 465 | 587 |
| EU | smtp.zoho.eu | 465 | 587 |
| India | smtp.zoho.in | 465 | 587 |
| Japan | smtp.zoho.jp | 465 | 587 |

> **Note:** For Zoho Mail EU accounts, use `smtp.zoho.eu`

---

### Option 2: ZeptoMail (Zoho's Transactional Email Service)

**Pros:**
- Dedicated transactional email service (better deliverability)
- Detailed analytics and tracking
- First 10,000 emails FREE
- Only $2.50 per 10,000 emails after
- Official Node.js SDK available

**Cons:**
- Requires separate ZeptoMail account setup
- Needs domain verification
- Additional service to manage

**Pricing:**
- Free tier: 10,000 emails
- Paid: $2.50 / 10,000 emails (pay-as-you-go)
- No monthly subscription required

**Implementation:**
```typescript
import { SendMailClient } from 'zeptomail';

const client = new SendMailClient({
  url: 'api.zeptomail.eu',
  token: process.env.ZEPTOMAIL_TOKEN,
});

await client.sendMail({
  from: { address: 'no-reply@metal-direct.ro', name: 'Metal Direct' },
  to: [{ email_address: { address: 'customer@example.com' } }],
  subject: 'Subject',
  htmlbody: '<h1>HTML content</h1>',
});
```

---

### Option 3: Zoho Mail API (REST)

**Pros:**
- Full API access to Zoho Mail features
- Can read/manage emails, not just send

**Cons:**
- Requires OAuth 2.0 setup (complex)
- Need to register app in Zoho Developer Console
- Token refresh handling required
- Overkill for just sending emails

**Not recommended for our use case** - we only need to send transactional emails.

---

## Recommended Approach: Nodemailer + Zoho SMTP

For Metal Direct, **Nodemailer with Zoho SMTP** is the best choice because:

1. **Immediate setup** - No additional accounts or API keys needed
2. **Zero cost** - Uses existing Zoho Mail accounts
3. **Simple migration** - Minimal code changes to existing `email.service.ts`
4. **Reliability** - Nodemailer is the most used Node.js email library
5. **Flexibility** - Easy to switch to another SMTP provider in the future

---

## Migration Steps

### Step 1: Install Nodemailer

```bash
cd backend
npm install nodemailer
npm install -D @types/nodemailer
```

### Step 2: Update Environment Variables

Replace AWS SES variables in `.env`:

```bash
# Remove AWS SES variables
# AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=

# Add Zoho SMTP variables
ZOHO_SMTP_HOST=smtp.zoho.eu
ZOHO_SMTP_PORT=465
ZOHO_MAIL_USER=no-reply@metal-direct.ro
ZOHO_MAIL_PASSWORD=Salmonella@18
ZOHO_OPERATOR_EMAIL=sales@metal-direct.ro
```

### Step 3: Update AWS Secrets Manager (Production)

```bash
# Update the backend secrets in AWS
aws secretsmanager update-secret \
  --secret-id metalpro/backend/secrets \
  --secret-string '{
    "DATABASE_URL": "...",
    "JWT_SECRET": "...",
    "ZOHO_SMTP_HOST": "smtp.zoho.eu",
    "ZOHO_SMTP_PORT": "465",
    "ZOHO_MAIL_USER": "no-reply@metal-direct.ro",
    "ZOHO_MAIL_PASSWORD": "Salmonella@18",
    "ZOHO_OPERATOR_EMAIL": "sales@metal-direct.ro"
  }' \
  --region eu-central-1
```

### Step 4: Update Email Service

Replace `email.service.ts` with Nodemailer implementation (see code below).

### Step 5: Update ECS Task Definition

Add new environment variables to the task definition and redeploy.

### Step 6: Test

```bash
# Test locally
npm run dev

# Test via API
curl -X POST http://localhost:3001/api/email-test/rfq-confirmation \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test-email@gmail.com"}'
```

---

## New Email Service Implementation

```typescript
// backend/src/services/email.service.ts
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

export class EmailService {
  private transporter: Transporter | null = null;
  private isDevelopment = process.env.NODE_ENV === 'development';

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    if (!ZOHO_MAIL_PASSWORD) {
      console.log('Email service running in DEVELOPMENT mode (no Zoho credentials)');
      console.log('Emails will be logged to console instead of being sent');
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host: ZOHO_SMTP_HOST,
        port: ZOHO_SMTP_PORT,
        secure: true, // true for 465, false for 587
        auth: {
          user: ZOHO_MAIL_USER,
          pass: ZOHO_MAIL_PASSWORD,
        },
      });

      console.log(`Email service initialized with Zoho SMTP (${ZOHO_SMTP_HOST})`);
    } catch (error) {
      console.error('Failed to initialize Zoho SMTP transporter:', error);
    }
  }

  private async sendEmail(to: string, subject: string, html: string, type: string): Promise<void> {
    try {
      if (!this.transporter) {
        // Development mode: Log to console
        console.log('\n===========================================');
        console.log(`[EMAIL - ${type}] Would send email via Zoho:`);
        console.log(`To: ${to}`);
        console.log(`From: ${ZOHO_MAIL_USER}`);
        console.log(`Subject: ${subject}`);
        console.log('===========================================\n');
        return;
      }

      // Production mode: Send via Zoho SMTP
      const info = await this.transporter.sendMail({
        from: `Metal Direct <${ZOHO_MAIL_USER}>`,
        to: to,
        subject: subject,
        html: html,
      });

      console.log(`Email sent successfully via Zoho: ${type} to ${to} (ID: ${info.messageId})`);
    } catch (error) {
      console.error(`Error sending email via Zoho (${type}):`, error);
      throw new Error(`Failed to send ${type} email via Zoho SMTP`);
    }
  }

  async verifyConnection(): Promise<boolean> {
    if (!this.transporter) {
      console.log('No Zoho SMTP transporter configured (development mode)');
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('Zoho SMTP connection verified successfully');
      return true;
    } catch (error) {
      console.error('Zoho SMTP verification failed:', error);
      return false;
    }
  }

  // ... rest of the email methods remain the same
  // (sendRFQConfirmation, notifyOperatorNewRFQ, sendVerificationEmail, etc.)
}

export const emailService = new EmailService();
```

---

## Zoho Mail Rate Limits

Zoho Mail has sending limits based on your plan:

| Plan | Daily Limit | Hourly Limit |
|------|-------------|--------------|
| Free | 50 emails | N/A |
| Mail Lite | 500 emails | N/A |
| Mail Premium | 1000 emails | N/A |
| Workplace | Varies | Varies |

> **Important:** If you expect high email volume (>500/day), consider:
> 1. Upgrading Zoho Mail plan
> 2. Using ZeptoMail for transactional emails
> 3. Using multiple sender accounts with round-robin

---

## Troubleshooting

### Error: "Invalid login"

1. Verify password is correct
2. Check if 2FA is enabled on Zoho account
3. If 2FA enabled, generate an App Password:
   - Login to Zoho Mail
   - Go to Settings > Security > App Passwords
   - Generate new app password for "Node.js App"
   - Use this password instead

### Error: "Connection refused"

1. Check firewall allows outbound port 465
2. Verify SMTP host matches your Zoho region (EU = smtp.zoho.eu)
3. Try port 587 with `secure: false` and `requireTLS: true`

### Error: "Rate limit exceeded"

1. Check your Zoho Mail plan limits
2. Implement email queuing with delays
3. Consider ZeptoMail for higher volume

### Emails going to spam

1. Verify SPF record includes Zoho:
   ```
   v=spf1 include:zoho.eu ~all
   ```
2. Set up DKIM in Zoho Mail admin
3. Add DMARC record:
   ```
   v=DMARC1; p=none; rua=mailto:admin@metal-direct.ro
   ```

---

## Security Notes

1. **Never commit passwords** - Use environment variables
2. **Use App Passwords** if 2FA is enabled
3. **Rotate passwords** periodically
4. **Monitor sending** - Watch for unusual activity

---

## Alternative: ZeptoMail Setup (If Needed Later)

If email volume increases significantly, migrate to ZeptoMail:

1. Sign up at https://www.zoho.com/zeptomail/
2. Verify domain (metal-direct.ro)
3. Get API token
4. Install SDK: `npm install zeptomail`
5. Update email service to use ZeptoMail SDK

---

## Summary

| Approach | Best For | Cost | Complexity |
|----------|----------|------|------------|
| **Nodemailer + SMTP** | Low-medium volume (<500/day) | Free | Low |
| ZeptoMail | High volume, analytics needed | $2.50/10K | Medium |
| Zoho Mail API | Full mailbox integration | Free | High |

**Recommendation:** Start with Nodemailer + Zoho SMTP. If you hit rate limits or need better analytics, migrate to ZeptoMail.

---

## Sources

- [Nodemailer Documentation](https://nodemailer.com/)
- [Zoho Mail API Overview](https://www.zoho.com/mail/help/api/overview.html)
- [ZeptoMail Node.js Guide](https://www.zoho.com/zeptomail/articles/sending-transactional-emails-in-nodejs.html)
- [ZeptoMail Pricing](https://www.zoho.com/zeptomail/pricing.html)
- [Nodemailer + Zoho SMTP Guide](https://medium.com/@bluedesk09/sending-email-with-zoho-nodejs-nodemailer-62de7fffc8ac)
- [Zoho SMTP Configuration](https://chinloongtan.com/blog/send-email-with-nodemailer-and-zoho-mail/)

---

**Last Updated:** December 22, 2025
**Version:** 1.0.0
