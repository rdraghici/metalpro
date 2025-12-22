import { Router, Request, Response } from 'express';
import { emailService } from '../services/email.service';

const router = Router();

/**
 * Test RFQ Submitted email
 * POST /api/email-test/rfq-submitted
 */
router.post('/rfq-submitted', async (req: Request, res: Response) => {
  try {
    const testEmail = req.body.email || 'test@example.com';

    await emailService.sendRFQSubmittedEmail({
      referenceNumber: 'RFQ-2025-TEST',
      customerEmail: testEmail,
      contactPerson: 'Ion Popescu',
      companyName: 'Test Company SRL',
      items: [
        {
          productSku: 'PIPE-RECT-100x60x3',
          productName: 'Țeavă rectangulară 100x60x3mm',
          quantity: 12,
          unit: 'm',
          grossPrice: 2520,
        },
        {
          productSku: 'PROFILE-HEA-200',
          productName: 'Profil HEA 200',
          quantity: 5,
          unit: 'buc',
          grossPrice: 1850,
        },
      ],
      estimatedTotal: 4370,
    });

    res.status(200).json({
      success: true,
      message: 'Email RFQ Submitted sent (or logged to console)',
      recipient: testEmail,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Test RFQ Quoted email
 * POST /api/email-test/rfq-quoted
 */
router.post('/rfq-quoted', async (req: Request, res: Response) => {
  try {
    const testEmail = req.body.email || 'test@example.com';

    await emailService.sendRFQQuotedEmail({
      referenceNumber: 'RFQ-2025-TEST',
      customerEmail: testEmail,
      contactPerson: 'Ion Popescu',
      companyName: 'Test Company SRL',
      items: [
        {
          productSku: 'PIPE-RECT-100x60x3',
          productName: 'Țeavă rectangulară 100x60x3mm',
          quantity: 12,
          unit: 'm',
          grossPrice: 2520,
          finalPrice: 2400, // Updated price
        },
        {
          productSku: 'PROFILE-HEA-200',
          productName: 'Profil HEA 200',
          quantity: 5,
          unit: 'buc',
          grossPrice: 1850,
          finalPrice: 1750, // Updated price
        },
      ],
      finalTotal: 4150,
    });

    res.status(200).json({
      success: true,
      message: 'Email RFQ Quoted sent (or logged to console)',
      recipient: testEmail,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
