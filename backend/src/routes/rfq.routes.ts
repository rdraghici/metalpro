import { Router, Request, Response, NextFunction } from 'express';
import { rfqService, CreateRFQData } from '../services/rfq.service';
import { authenticate, optionalAuth } from '../middleware/auth.middleware';
import logger from '../config/logger';

const router = Router();

// =====================================================
// RFQ ROUTES
// =====================================================

/**
 * POST /api/rfq
 * Create a new RFQ submission (works for both authenticated and guest users)
 */
router.post('/', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id || null;

    // Log the entire request body for debugging
    console.log('🔍 RFQ Request Body:', JSON.stringify(req.body, null, 2));

    // Validate required fields
    const { companyName, contactPerson, email, phone, items, estimatedTotal } = req.body;

    console.log('📋 Extracted fields:', { companyName, contactPerson, email, phone, itemsCount: items?.length, estimatedTotal });

    if (!companyName || !contactPerson || !email || !phone) {
      console.log('❌ Validation failed - missing:', {
        companyName: !companyName,
        contactPerson: !contactPerson,
        email: !email,
        phone: !phone
      });
      return res.status(400).json({
        success: false,
        message: 'Missing required contact information',
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'RFQ must contain at least one item',
      });
    }

    if (!estimatedTotal || estimatedTotal <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid estimated total',
      });
    }

    // Validate each item
    for (const item of items) {
      if (!item.productSku || !item.productName || !item.quantity || !item.unit) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have productSku, productName, quantity, and unit',
        });
      }
    }

    const rfqData: CreateRFQData = {
      companyName,
      contactPerson,
      email,
      phone,
      taxId: req.body.taxId,
      registrationNumber: req.body.registrationNumber,
      shippingAddress: req.body.shippingAddress,
      billingAddress: req.body.billingAddress,
      incoterm: req.body.incoterm,
      deliveryDate: req.body.deliveryDate,
      notes: req.body.notes,
      items,
      estimatedTotal,
    };

    const rfq = await rfqService.createRFQ(userId, rfqData);

    logger.info('RFQ created', {
      rfqId: rfq.id,
      referenceNumber: rfq.referenceNumber,
      userId,
      itemCount: items.length,
      estimatedTotal,
    });

    res.status(201).json({
      success: true,
      data: {
        rfq: {
          id: rfq.id,
          referenceNumber: rfq.referenceNumber,
          status: rfq.status,
          companyName: rfq.companyName,
          contactPerson: rfq.contactPerson,
          email: rfq.email,
          phone: rfq.phone,
          estimatedTotal: rfq.estimatedTotal,
          submittedAt: rfq.submittedAt,
          items: (rfq as any).items,
        },
      },
      message: `RFQ ${rfq.referenceNumber} submitted successfully`,
    });
  } catch (error: any) {
    logger.error('Error creating RFQ', {
      error: error.message,
      stack: error.stack,
    });
    next(error);
  }
});

/**
 * GET /api/rfq
 * Get all RFQs for the authenticated user
 */
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;

    const rfqs = await rfqService.getUserRFQs(userId);

    res.json({
      success: true,
      data: { rfqs },
    });
  } catch (error: any) {
    logger.error('Error fetching user RFQs', {
      error: error.message,
      stack: error.stack,
    });
    next(error);
  }
});

/**
 * GET /api/rfq/:id
 * Get a specific RFQ by ID
 */
router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const rfqId = req.params.id;

    const rfq = await rfqService.getRFQById(rfqId, userId);

    res.json({
      success: true,
      data: { rfq },
    });
  } catch (error: any) {
    if (error.message === 'RFQ not found') {
      return res.status(404).json({
        success: false,
        message: 'RFQ not found',
      });
    }

    logger.error('Error fetching RFQ', {
      error: error.message,
      stack: error.stack,
    });
    next(error);
  }
});

export default router;
