import { Router, Request, Response } from 'express';

const router = Router();

// =====================================================
// CART ROUTES (To be implemented later)
// =====================================================

router.get('/', (req: Request, res: Response) => {
  res.status(501).json({
    success: false,
    message: 'Cart endpoints will be implemented in a future phase',
  });
});

export default router;
