import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../config/database';

const router = Router();

// =====================================================
// USER ROUTES (Authenticated)
// =====================================================

// GET /api/users/me - Get current user
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    res.json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user',
    });
  }
});

// PATCH /api/users/me - Update current user profile
router.patch('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone } = req.body;
    const userId = req.user.id;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        updatedAt: new Date(),
      },
      include: { company: true },
    });

    // Remove password hash
    const { passwordHash, ...sanitizedUser } = updatedUser;

    res.json({
      success: true,
      data: sanitizedUser,
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
    });
  }
});

// PATCH /api/users/me/company - Update company info
router.patch('/me/company', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { legalName, cui, address, city, county, postalCode } = req.body;
    const userId = req.user.id;

    // Check if user has a company
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    let company;
    if (user.company) {
      // Update existing company
      company = await prisma.company.update({
        where: { id: user.company.id },
        data: {
          ...(legalName && { legalName }),
          ...(cui && { cui }),
          ...(address && { address }),
          ...(city && { city }),
          ...(county && { county }),
          ...(postalCode && { postalCode }),
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new company
      company = await prisma.company.create({
        data: {
          userId,
          legalName: legalName || '',
          cui,
          address,
          city,
          county,
          postalCode,
        },
      });
    }

    res.json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update company',
    });
  }
});

export default router;
