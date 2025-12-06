import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireBackoffice } from '../middleware/rbac';
import { backofficeRFQService } from '../services/backoffice-rfq.service';
import { RFQStatus } from '@prisma/client';

const router = Router();

// All back-office RFQ routes require authentication and BACKOFFICE or ADMIN role
router.use(authenticate);
router.use(requireBackoffice);

/**
 * GET /api/backoffice/rfqs
 * Get all RFQs with filters and pagination
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      status,
      assignedToId,
      companyName,
      dateFrom,
      dateTo,
      minValue,
      maxValue,
      page,
      limit,
      sortBy,
      sortOrder,
    } = req.query;

    const filters: any = {};
    if (status) filters.status = status as RFQStatus;
    if (assignedToId) filters.assignedToId = assignedToId as string;
    if (companyName) filters.companyName = companyName as string;
    if (dateFrom) filters.dateFrom = new Date(dateFrom as string);
    if (dateTo) filters.dateTo = new Date(dateTo as string);
    if (minValue) filters.minValue = parseFloat(minValue as string);
    if (maxValue) filters.maxValue = parseFloat(maxValue as string);

    const options: any = {};
    if (page) options.page = parseInt(page as string);
    if (limit) options.limit = parseInt(limit as string);
    if (sortBy) options.sortBy = sortBy as any;
    if (sortOrder) options.sortOrder = sortOrder as 'asc' | 'desc';

    const result = await backofficeRFQService.getRFQs(filters, options);

    res.json(result);
  } catch (error: any) {
    console.error('Error getting RFQs:', error);
    res.status(500).json({ error: 'Failed to fetch RFQs', message: error.message });
  }
});

/**
 * GET /api/backoffice/rfqs/statistics
 * Get RFQ statistics for dashboard
 */
router.get('/statistics', async (req: Request, res: Response) => {
  try {
    const { dateFrom, dateTo } = req.query;

    const filters: any = {};
    if (dateFrom) filters.dateFrom = new Date(dateFrom as string);
    if (dateTo) filters.dateTo = new Date(dateTo as string);

    const statistics = await backofficeRFQService.getStatistics(filters);

    res.json(statistics);
  } catch (error: any) {
    console.error('Error getting statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics', message: error.message });
  }
});

/**
 * GET /api/backoffice/rfqs/operator-performance
 * Get operator performance metrics
 */
router.get('/operator-performance', async (req: Request, res: Response) => {
  try {
    const { operatorId, dateFrom, dateTo } = req.query;

    const filters: any = {};
    if (dateFrom) filters.dateFrom = new Date(dateFrom as string);
    if (dateTo) filters.dateTo = new Date(dateTo as string);

    const performance = await backofficeRFQService.getOperatorPerformance(
      operatorId as string | undefined,
      filters
    );

    res.json(performance);
  } catch (error: any) {
    console.error('Error getting operator performance:', error);
    res.status(500).json({
      error: 'Failed to fetch operator performance',
      message: error.message,
    });
  }
});

/**
 * GET /api/backoffice/rfqs/:id
 * Get single RFQ by ID with full details
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const rfq = await backofficeRFQService.getRFQById(req.params.id);
    console.log('🔍 RFQ Detail Data:', JSON.stringify({
      id: rfq.id,
      referenceNumber: rfq.referenceNumber,
      companyName: rfq.companyName,
      contactPerson: rfq.contactPerson,
      email: rfq.email,
      phone: rfq.phone,
      itemsCount: rfq.items?.length,
      submittedAt: rfq.submittedAt,
      hasUser: !!rfq.user
    }, null, 2));
    res.json(rfq);
  } catch (error: any) {
    console.error('Error getting RFQ:', error);
    res.status(404).json({ error: 'RFQ not found', message: error.message });
  }
});

/**
 * PATCH /api/backoffice/rfqs/:id/status
 * Update RFQ status and assignment
 */
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status, assignedToId, internalNotes, customerNotes } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const rfq = await backofficeRFQService.updateRFQStatus(
      req.params.id,
      { status, assignedToId, internalNotes, customerNotes },
      req.user!.id
    );

    res.json(rfq);
  } catch (error: any) {
    console.error('Error updating RFQ status:', error);
    res.status(500).json({ error: 'Failed to update RFQ status', message: error.message });
  }
});

/**
 * PATCH /api/backoffice/rfqs/:id/pricing
 * Update RFQ pricing (line items and totals)
 */
router.patch('/:id/pricing', async (req: Request, res: Response) => {
  try {
    const { items, deliveryCost, processingFee, vatAmount, finalQuoteAmount } = req.body;

    const rfq = await backofficeRFQService.updateRFQPricing(req.params.id, {
      items,
      deliveryCost,
      processingFee,
      vatAmount,
      finalQuoteAmount,
    });

    res.json(rfq);
  } catch (error: any) {
    console.error('Error updating RFQ pricing:', error);
    res.status(500).json({ error: 'Failed to update RFQ pricing', message: error.message });
  }
});

/**
 * PATCH /api/backoffice/rfqs/:id/assign
 * Assign RFQ to operator
 */
router.patch('/:id/assign', async (req: Request, res: Response) => {
  try {
    const { operatorId } = req.body;

    if (!operatorId) {
      return res.status(400).json({ error: 'Operator ID is required' });
    }

    const rfq = await backofficeRFQService.assignRFQ(req.params.id, operatorId);

    res.json(rfq);
  } catch (error: any) {
    console.error('Error assigning RFQ:', error);
    res.status(500).json({ error: 'Failed to assign RFQ', message: error.message });
  }
});

export default router;
