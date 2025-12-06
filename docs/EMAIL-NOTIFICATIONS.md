# Email Notification System

## Overview

The MetalPro email notification system is built using AWS SES (Simple Email Service) to send automated emails to customers and back-office operators throughout the RFQ (Request for Quote) workflow.

## Architecture

### Components

1. **Email Service** (`src/services/email.service.ts`)
   - Centralized email management
   - AWS SES integration
   - Development mode support (logs to console)
   - Professional HTML email templates

2. **Integration Points**
   - RFQ submission (customer-facing)
   - RFQ status updates (back-office)
   - Quote generation and delivery

## Email Templates

### 1. RFQ Confirmation (Customer)
**Trigger:** When customer submits new RFQ
**Function:** `emailService.sendRFQConfirmation()`
**Recipients:** Customer email
**Purpose:** Confirm receipt of RFQ submission

**Email Content:**
- RFQ reference number
- Company details
- Estimated total
- Link to order tracking

### 2. RFQ Acknowledgment (Customer)
**Trigger:** When operator marks RFQ as ACKNOWLEDGED
**Function:** `emailService.sendRFQAcknowledgment()`
**Recipients:** Customer email
**Purpose:** Notify customer that RFQ is being processed

**Email Content:**
- Status update
- Estimated processing time (24-48 hours)
- Contact information
- Link to order tracking

### 3. Quote Ready (Customer)
**Trigger:** When operator marks RFQ as QUOTED with pricing
**Function:** `emailService.sendQuoteReady()`
**Recipients:** Customer email
**Purpose:** Notify customer that quote is ready

**Email Content:**
- Final quote amount
- PDF download link (placeholder)
- Contact information for questions

### 4. New RFQ Notification (Operator)
**Trigger:** When customer submits new RFQ
**Function:** `emailService.notifyOperatorNewRFQ()`
**Recipients:** Back-office operator email (configured via `OPERATOR_EMAIL`)
**Purpose:** Alert operators of new RFQ requiring action

**Email Content:**
- Customer details
- Company information
- Estimated total
- Direct link to RFQ in back-office
- Response time expectations

### 5. Email Verification (User Registration)
**Trigger:** When new user registers
**Function:** `emailService.sendVerificationEmail()`
**Recipients:** New user email
**Purpose:** Verify email address

### 6. Password Reset (User Authentication)
**Trigger:** When user requests password reset
**Function:** `emailService.sendPasswordResetEmail()`
**Recipients:** User email
**Purpose:** Provide secure password reset link

## Configuration

### Environment Variables

Required in `.env` file:

```env
# AWS SES Configuration
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Email Settings
SES_FROM_EMAIL=noreply@metal-direct.ro
OPERATOR_EMAIL=sales@metal-direct.ro

# Application URLs
FRONTEND_URL=https://metal-direct.ro
BACKEND_URL=https://api.metal-direct.ro
```

### AWS SES Setup

1. **Verify Domain**
   ```bash
   aws ses verify-domain-identity --domain metal-direct.ro --region eu-central-1
   ```

2. **Add DNS Records**
   - Add TXT record for domain verification
   - Add DKIM records for email authentication
   - Add SPF record for sender authentication

3. **Move Out of Sandbox Mode**
   - Request production access from AWS SES
   - Enables sending to any email address
   - Increases sending limits

4. **Create IAM User for SES**
   ```bash
   aws iam create-user --user-name ses-smtp-user
   aws iam put-user-policy --user-name ses-smtp-user --policy-name ses-send-email --policy-document file://ses-policy.json
   ```

   **ses-policy.json:**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": ["ses:SendEmail", "ses:SendRawEmail"],
         "Resource": "*"
       }
     ]
   }
   ```

## Development Mode

When AWS credentials are not configured, the email service automatically runs in development mode:

- Emails are **not** sent via AWS SES
- Email content is logged to console
- All email functions work normally
- Useful for local development and testing

**Console Output Example:**
```
===========================================
📧 [EMAIL - RFQ Confirmation] Would send email via SES:
To: customer@example.com
From: noreply@metal-direct.ro
Subject: Confirmare RFQ RFQ-2024-001 - MetalPro
===========================================
```

## Usage Examples

### Sending RFQ Confirmation

```typescript
import { emailService } from './services/email.service';

// After RFQ creation
await emailService.sendRFQConfirmation({
  id: rfq.id,
  referenceNumber: rfq.referenceNumber,
  companyName: rfq.companyName,
  cui: rfq.cui,
  contactPerson: rfq.contactPerson,
  email: rfq.email,
  phone: rfq.phone,
  estimatedTotal: rfq.estimatedTotal,
  deliveryDate: rfq.deliveryDate?.toISOString().split('T')[0],
});
```

### Sending Operator Notification

```typescript
// After RFQ submission
await emailService.notifyOperatorNewRFQ({
  id: rfq.id,
  referenceNumber: rfq.referenceNumber,
  companyName: rfq.companyName,
  cui: rfq.cui,
  contactPerson: rfq.contactPerson,
  email: rfq.email,
  phone: rfq.phone,
  estimatedTotal: rfq.estimatedTotal,
});
```

### Updating RFQ Status with Email

```typescript
// In backoffice-rfq.service.ts
await backofficeRFQService.updateRFQStatus(rfqId, {
  status: 'ACKNOWLEDGED', // Triggers acknowledgment email
});

await backofficeRFQService.updateRFQStatus(rfqId, {
  status: 'QUOTED', // Triggers quote ready email (if pricing is set)
});
```

## Email Templates Design

All emails follow a consistent design:

- **Responsive HTML** - Works on desktop and mobile
- **Professional branding** - MetalPro colors and logo
- **Clear CTAs** - Prominent action buttons
- **Bilingual** - Romanian language (target market)
- **Status colors** - Visual indicators for different statuses
- **Contact information** - Always included for support

### Color Scheme

- Primary Blue: `#0066cc` (Headers, buttons)
- Success Green: `#28a745` (Positive actions)
- Warning Yellow: `#ffc107` (Important notices)
- Danger Red: `#dc3545` (Critical actions)
- Info Blue: `#0d6efd` (Information boxes)

## Error Handling

Email sending is **non-blocking** - if an email fails to send, the operation continues:

```typescript
try {
  await emailService.sendRFQAcknowledgment(rfq);
} catch (emailError) {
  // Log error but don't fail the status update
  console.error('Failed to send email:', emailError);
}
```

This ensures that RFQ workflow continues even if email service is temporarily unavailable.

## Testing

### Manual Testing

Test individual email templates:

```typescript
// In email-test.routes.ts
POST /api/email-test/rfq-confirmation
POST /api/email-test/rfq-acknowledgment
POST /api/email-test/quote-ready
POST /api/email-test/operator-notification
```

### Integration Testing

Test full RFQ workflow with emails:

```typescript
describe('RFQ Email Flow', () => {
  it('should send confirmation email on RFQ submission', async () => {
    const rfq = await createRFQ(testData);
    // Verify email was logged (dev mode) or sent (production)
  });

  it('should send acknowledgment email on status update', async () => {
    await updateRFQStatus(rfqId, { status: 'ACKNOWLEDGED' });
    // Verify email sent
  });
});
```

## Monitoring

### AWS SES Metrics

Monitor in AWS CloudWatch:
- Send rate
- Bounce rate
- Complaint rate
- Delivery rate

### Application Logs

Email sending is logged:

```
✅ Email sent successfully via SES: RFQ Confirmation to customer@example.com (Message ID: 0000...)
❌ Error sending email via SES (RFQ Acknowledgment): [error details]
```

## Best Practices

1. **Always include unsubscribe option** (for marketing emails)
2. **Keep emails under 102KB** (AWS SES limit)
3. **Use transaction email best practices** (no marketing content)
4. **Include plain text alternative** (for email clients that don't support HTML)
5. **Test emails across different clients** (Gmail, Outlook, Apple Mail)
6. **Monitor bounce and complaint rates** (keep below AWS thresholds)
7. **Use email verification** (verify customer emails before sending quotes)

## Troubleshooting

### Emails Not Sending

1. **Check AWS credentials**
   ```bash
   aws ses verify-email-identity --email-address test@metal-direct.ro
   ```

2. **Verify domain/email in SES**
   ```bash
   aws ses get-identity-verification-attributes --identities metal-direct.ro
   ```

3. **Check SES sandbox mode**
   - In sandbox: can only send to verified emails
   - Request production access to send to any email

4. **Review application logs**
   ```bash
   grep "Email sent" logs/app.log
   grep "Error sending email" logs/app.log
   ```

### High Bounce Rate

- Validate customer emails before sending
- Remove invalid emails from database
- Check email format validation in forms

### Emails in Spam

- Ensure SPF, DKIM, and DMARC records are configured
- Avoid spam trigger words in subject/content
- Monitor AWS SES reputation metrics
- Request dedicated IP address (for high volume)

## Future Enhancements

1. **Email Queue** - Use SQS for reliable delivery
2. **Email Templates System** - Allow operators to customize templates
3. **Email Preferences** - Let users choose notification types
4. **Email Analytics** - Track open rates and click-through rates
5. **Multi-language Support** - Auto-translate based on user language preference
6. **PDF Attachments** - Attach quote PDF directly to email
7. **Email Scheduling** - Schedule quote emails for optimal delivery time

## Security

- **No sensitive data in emails** (passwords, tokens, etc.)
- **HTTPS links only** (no HTTP)
- **Secure token generation** (for password reset, email verification)
- **Rate limiting** (prevent email bombing)
- **Email validation** (prevent injection attacks)
- **AWS IAM permissions** (least privilege principle)

## Compliance

- **GDPR** - Include data processing information
- **CAN-SPAM** - Include physical address and unsubscribe
- **PECR** - Obtain consent for marketing emails
- **Data retention** - Store email logs per compliance requirements
