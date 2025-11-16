# AWS SES Setup Guide

## Overview

The MetalPro Backend now uses **AWS SES (Simple Email Service)** for sending transactional emails. This guide will help you set up SES for production.

---

## Development Mode

In development, emails are **logged to console** instead of being sent. No AWS credentials are required.

```bash
# Development - leave AWS credentials empty in .env
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

When you test emails, you'll see output like:
```
📧 [EMAIL - RFQ Confirmation] Would send email via SES:
To: customer@example.com
From: noreply@metalpro.ro
Subject: Confirmare RFQ RFQ-2025-00042 - MetalPro
```

---

## Production Setup

### Step 1: Create AWS Account

1. Go to https://aws.amazon.com/
2. Create an AWS account (if you don't have one)
3. Note: You may need to verify your identity and add a payment method

### Step 2: Access AWS SES Console

1. Log in to AWS Console
2. Search for "SES" or "Simple Email Service"
3. Select your preferred region (e.g., `us-east-1`, `eu-west-1`)
   - **Important**: Remember this region, you'll need it for `.env`

### Step 3: Verify Email Addresses

#### Verify Sender Email (Required)

1. In SES Console, go to **Verified Identities**
2. Click **Create identity**
3. Select **Email address**
4. Enter your sender email: `noreply@metalpro.ro`
5. Click **Create identity**
6. Check your email inbox for verification email from AWS
7. Click the verification link

#### Verify Operator Email (Recommended)

1. Repeat the same process for `sales@metalpro.ro`
2. This allows you to receive RFQ notification emails

### Step 4: Request Production Access

By default, SES is in **Sandbox Mode**, which limits you to:
- Only sending to verified email addresses
- 200 emails per day
- 1 email per second

To remove these limits:

1. In SES Console, go to **Account dashboard**
2. Click **Request production access**
3. Fill out the form:
   - **Mail type**: Transactional
   - **Website URL**: Your MetalPro website URL
   - **Use case description**:
     ```
     MetalPro B2B platform for steel products. We send transactional emails:
     - RFQ confirmation emails to customers
     - Order notifications to operators
     - Email verification for new users
     - Password reset emails
     - Quote ready notifications

     Estimated volume: 1000-5000 emails/month
     ```
4. Submit the request
5. Wait for approval (usually 24-48 hours)

### Step 5: Create IAM User

1. In AWS Console, go to **IAM** (Identity and Access Management)
2. Click **Users** → **Create user**
3. User name: `metalpro-ses-user`
4. Click **Next**
5. Select **Attach policies directly**
6. Search for and select: **AmazonSESFullAccess**
7. Click **Next** → **Create user**

### Step 6: Generate Access Keys

1. Click on the user you just created (`metalpro-ses-user`)
2. Go to **Security credentials** tab
3. Scroll down to **Access keys**
4. Click **Create access key**
5. Select use case: **Application running outside AWS**
6. Click **Next** → **Create access key**
7. **Important**: Copy both:
   - Access key ID
   - Secret access key
   - ⚠️ You won't be able to see the secret key again!

### Step 7: Update Environment Variables

Update your production `.env` file:

```bash
# Email Service (AWS SES)
AWS_REGION=us-east-1                           # Replace with your region
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE         # Your access key
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG... # Your secret key
SES_FROM_EMAIL=noreply@metalpro.ro             # Verified sender email
OPERATOR_EMAIL=sales@metalpro.ro               # Verified operator email
```

### Step 8: Test Production Email

Once configured, test the email service:

```bash
# Test RFQ confirmation email
curl -X POST https://your-production-domain.com/api/email-test/rfq-confirmation \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Test all email types
curl -X POST https://your-production-domain.com/api/email-test/all \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

Check the server logs for success messages:
```
✅ Email sent successfully via SES: RFQ Confirmation to test@example.com (Message ID: 010001...)
```

---

## Email Types

The system sends 5 types of emails:

1. **RFQ Confirmation** - Sent to customers when they submit a quote request
2. **Operator Notification** - Sent to `OPERATOR_EMAIL` when new RFQ arrives
3. **Email Verification** - Sent to new users to verify their email address
4. **Password Reset** - Sent when users request password reset
5. **Quote Ready** - Sent to customers when their quote is ready

---

## Monitoring & Metrics

### Check Email Sending Activity

1. Go to SES Console → **Account dashboard**
2. View metrics:
   - Sends
   - Deliveries
   - Bounces
   - Complaints

### Set Up Bounce/Complaint Handling

1. In SES Console, go to **Configuration sets**
2. Create a configuration set for tracking
3. Add SNS topics for:
   - Bounces (email doesn't exist)
   - Complaints (marked as spam)
4. Update email service to use configuration set (optional)

---

## Cost Estimation

AWS SES pricing (as of 2025):

- **First 62,000 emails/month**: $0 (FREE with EC2/Lambda)
- **Additional emails**: $0.10 per 1,000 emails

**Example for MetalPro:**
- 5,000 emails/month = **FREE** ✅
- 100,000 emails/month = **~$4/month**

Very affordable compared to SendGrid or other services!

---

## Troubleshooting

### Error: "Email address not verified"

**Problem**: Trying to send to unverified email in Sandbox mode

**Solution**:
1. Either verify the recipient email in SES Console
2. Or request production access (recommended)

### Error: "Invalid AWS credentials"

**Problem**: Wrong access key or secret key

**Solution**:
1. Double-check `.env` values
2. Ensure no extra spaces or quotes
3. Generate new access keys if needed

### Error: "Message rejected: Email address is not verified"

**Problem**: Sender email (`SES_FROM_EMAIL`) not verified

**Solution**:
1. Go to SES Console → Verified Identities
2. Verify `noreply@metalpro.ro`
3. Check verification email inbox

### Emails not being sent (no error)

**Problem**: Email service running in development mode

**Solution**:
1. Check `NODE_ENV=production` in `.env`
2. Ensure `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are set
3. Restart the server

---

## Security Best Practices

### 1. Use IAM User (Not Root Account)

✅ Create dedicated IAM user with only SES permissions
❌ Never use AWS root account credentials

### 2. Rotate Access Keys Regularly

- Rotate keys every 90 days
- Create new keys before deleting old ones
- Update `.env` and restart server

### 3. Restrict IAM Permissions

Consider using a more restrictive policy instead of `AmazonSESFullAccess`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    }
  ]
}
```

### 4. Never Commit Credentials

- ✅ `.env` is in `.gitignore`
- ❌ Never commit AWS keys to Git
- ✅ Use environment variables in production

---

## Future Enhancements

### 1. Inbound Email Processing

Use **SES + S3 + Lambda** to process incoming emails:

1. Configure SES to receive emails
2. Store incoming emails in S3
3. Trigger Lambda function to process RFQ emails
4. Automatically create RFQ records in database

### 2. Email Templates in SES

Store email templates in SES for easier management:

```typescript
// Instead of HTML strings in code
await sesClient.send(new SendTemplatedEmailCommand({
  Template: 'RFQConfirmationTemplate',
  TemplateData: JSON.stringify(rfqData)
}));
```

### 3. Email Analytics

Integrate with SNS to track:
- Open rates
- Click rates
- Bounce rates
- Complaint rates

---

## Support

For AWS SES support:
- AWS Documentation: https://docs.aws.amazon.com/ses/
- AWS Support: https://console.aws.amazon.com/support/

For MetalPro Backend issues:
- Check server logs
- Review `SECURITY.md` for security considerations
- Contact backend team

---

## Summary Checklist

Before deploying to production:

- [ ] AWS account created
- [ ] SES region selected (e.g., `us-east-1`)
- [ ] Sender email verified (`noreply@metalpro.ro`)
- [ ] Operator email verified (`sales@metalpro.ro`)
- [ ] Production access requested and approved
- [ ] IAM user created with SES permissions
- [ ] Access keys generated and saved securely
- [ ] Environment variables updated in production `.env`
- [ ] Server restarted with new configuration
- [ ] Test email sent successfully
- [ ] Monitoring set up for bounces/complaints

---

**Last Updated**: November 15, 2025
**Version**: 1.0.0
