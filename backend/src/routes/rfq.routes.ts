import { Router, Request, Response } from 'express';

const router = Router();

// =====================================================
// RFQ ROUTES (To be implemented later)
// =====================================================

router.post('/', (req: Request, res: Response) => {
  res.status(501).json({
    success: false,
    message: 'RFQ endpoints will be implemented in a future phase',
  });
});

export default router;
