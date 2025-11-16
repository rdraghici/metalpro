import { Router, Request, Response } from 'express';
import { emailService } from '../services/email.service';

const router = Router();

/**
 * Test endpoint for RFQ confirmation email
 * POST /api/email-test/rfq-confirmation
 */
router.post('/rfq-confirmation', async (req: Request, res: Response) => {
  try {
    const testRFQ = {
      id: 'test-rfq-123',
      referenceNumber: 'RFQ-2025-00042',
      companyName: 'Test Company SRL',
      cui: 'RO12345678',
      contactPerson: 'Ion Popescu',
      email: req.body.email || 'test@example.com',
      phone: '+40 722 123 456',
      estimatedTotal: 15420.50,
      deliveryDate: '2025-02-15',
    };

    await emailService.sendRFQConfirmation(testRFQ);

    res.status(200).json({
      success: true,
      message: 'Email de confirmare RFQ trimis cu succes (sau logat în consolă)',
      data: {
        type: 'RFQ Confirmation',
        recipient: testRFQ.email,
      },
    });
  } catch (error: any) {
    console.error('Error sending test email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send test email',
      details: error.message,
    });
  }
});

/**
 * Test endpoint for operator notification
 * POST /api/email-test/operator-notification
 */
router.post('/operator-notification', async (req: Request, res: Response) => {
  try {
    const testRFQ = {
      id: 'test-rfq-456',
      referenceNumber: 'RFQ-2025-00043',
      companyName: 'Important Client SA',
      cui: 'RO87654321',
      contactPerson: 'Maria Ionescu',
      email: 'maria@client.ro',
      phone: '+40 722 987 654',
      estimatedTotal: 28750.00,
      deliveryDate: '2025-02-20',
    };

    await emailService.notifyOperatorNewRFQ(testRFQ);

    res.status(200).json({
      success: true,
      message: 'Email de notificare operator trimis cu succes (sau logat în consolă)',
      data: {
        type: 'Operator Notification',
        recipient: process.env.OPERATOR_EMAIL,
      },
    });
  } catch (error: any) {
    console.error('Error sending test email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send test email',
      details: error.message,
    });
  }
});

/**
 * Test endpoint for email verification
 * POST /api/email-test/email-verification
 */
router.post('/email-verification', async (req: Request, res: Response) => {
  try {
    const testEmail = req.body.email || 'test@example.com';
    const testUserId = 'test-user-789';
    const testToken = 'mock-verification-token-abc123xyz789';

    await emailService.sendVerificationEmail(testEmail, testUserId, testToken);

    res.status(200).json({
      success: true,
      message: 'Email de verificare trimis cu succes (sau logat în consolă)',
      data: {
        type: 'Email Verification',
        recipient: testEmail,
      },
    });
  } catch (error: any) {
    console.error('Error sending test email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send test email',
      details: error.message,
    });
  }
});

/**
 * Test endpoint for password reset
 * POST /api/email-test/password-reset
 */
router.post('/password-reset', async (req: Request, res: Response) => {
  try {
    const testEmail = req.body.email || 'test@example.com';
    const testToken = 'mock-reset-token-xyz789abc123';

    await emailService.sendPasswordResetEmail(testEmail, testToken);

    res.status(200).json({
      success: true,
      message: 'Email de resetare parolă trimis cu succes (sau logat în consolă)',
      data: {
        type: 'Password Reset',
        recipient: testEmail,
      },
    });
  } catch (error: any) {
    console.error('Error sending test email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send test email',
      details: error.message,
    });
  }
});

/**
 * Test endpoint for quote ready notification
 * POST /api/email-test/quote-ready
 */
router.post('/quote-ready', async (req: Request, res: Response) => {
  try {
    const testQuote = {
      referenceNumber: 'RFQ-2025-00042',
      contactPerson: 'Ion Popescu',
      email: req.body.email || 'test@example.com',
      finalQuoteAmount: 17850.75,
      pdfUrl: 'http://localhost:3001/uploads/quotes/test-quote.pdf',
    };

    await emailService.sendQuoteReady(testQuote);

    res.status(200).json({
      success: true,
      message: 'Email ofertă gata trimis cu succes (sau logat în consolă)',
      data: {
        type: 'Quote Ready',
        recipient: testQuote.email,
      },
    });
  } catch (error: any) {
    console.error('Error sending test email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send test email',
      details: error.message,
    });
  }
});

/**
 * Test all email types at once
 * POST /api/email-test/all
 */
router.post('/all', async (req: Request, res: Response) => {
  try {
    const testEmail = req.body.email || 'test@example.com';
    const results = [];

    // Test RFQ Confirmation
    try {
      await emailService.sendRFQConfirmation({
        id: 'test-1',
        referenceNumber: 'RFQ-2025-00001',
        companyName: 'Test Company',
        contactPerson: 'Test User',
        email: testEmail,
        phone: '+40 722 123 456',
        estimatedTotal: 10000,
      });
      results.push({ type: 'RFQ Confirmation', status: 'success' });
    } catch (err) {
      results.push({ type: 'RFQ Confirmation', status: 'failed', error: (err as Error).message });
    }

    // Test Operator Notification
    try {
      await emailService.notifyOperatorNewRFQ({
        id: 'test-2',
        referenceNumber: 'RFQ-2025-00002',
        companyName: 'Test Company',
        contactPerson: 'Test User',
        email: testEmail,
        phone: '+40 722 123 456',
        estimatedTotal: 15000,
      });
      results.push({ type: 'Operator Notification', status: 'success' });
    } catch (err) {
      results.push({ type: 'Operator Notification', status: 'failed', error: (err as Error).message });
    }

    // Test Email Verification
    try {
      await emailService.sendVerificationEmail(testEmail, 'test-user-id', 'test-token');
      results.push({ type: 'Email Verification', status: 'success' });
    } catch (err) {
      results.push({ type: 'Email Verification', status: 'failed', error: (err as Error).message });
    }

    // Test Password Reset
    try {
      await emailService.sendPasswordResetEmail(testEmail, 'test-reset-token');
      results.push({ type: 'Password Reset', status: 'success' });
    } catch (err) {
      results.push({ type: 'Password Reset', status: 'failed', error: (err as Error).message });
    }

    // Test Quote Ready
    try {
      await emailService.sendQuoteReady({
        referenceNumber: 'RFQ-2025-00003',
        contactPerson: 'Test User',
        email: testEmail,
        finalQuoteAmount: 20000,
        pdfUrl: 'http://localhost:3001/test.pdf',
      });
      results.push({ type: 'Quote Ready', status: 'success' });
    } catch (err) {
      results.push({ type: 'Quote Ready', status: 'failed', error: (err as Error).message });
    }

    res.status(200).json({
      success: true,
      message: 'Toate testele de email au fost executate',
      data: {
        recipient: testEmail,
        results,
      },
    });
  } catch (error: any) {
    console.error('Error in email test suite:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to run email test suite',
      details: error.message,
    });
  }
});

export default router;
