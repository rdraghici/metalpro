import { Router, Request, Response } from 'express';
import { authService } from '../services/auth.service';

const router = Router();

// =====================================================
// AUTH ROUTES
// =====================================================

// POST /api/auth/signup - Create new user account
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone, role, company } = req.body;

    // Basic validation
    if (!email || !password || !name || !role) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, name, and role are required',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Parola trebuie să conțină cel puțin 8 caractere',
      });
    }

    const result = await authService.signup({
      email,
      password,
      name,
      phone,
      role,
      company,
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Signup failed',
    });
  }
});

// POST /api/auth/login - Login with email and password
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    const result = await authService.login(email, password);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    });
  }
});

// POST /api/auth/logout - Invalidate session
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      await authService.logout(token);
    }

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed',
    });
  }
});

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required',
      });
    }

    const result = await authService.refreshToken(refreshToken);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid or expired refresh token',
    });
  }
});

export default router;
