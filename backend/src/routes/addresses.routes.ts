import { Router, Request, Response } from 'express';

const router = Router();

// =====================================================
// ADDRESSES ROUTES (To be implemented later)
// =====================================================

router.get('/', (req: Request, res: Response) => {
  res.status(501).json({
    success: false,
    message: 'Addresses endpoints will be implemented in a future phase',
  });
});

export default router;
