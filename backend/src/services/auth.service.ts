import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { User, Company } from '@prisma/client';

// =====================================================
// TYPES
// =====================================================

interface SignupData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'INDIVIDUAL' | 'BUSINESS';
  company?: {
    name: string;
    cui?: string;
    address?: string;
    city?: string;
    county?: string;
    postalCode?: string;
  };
}

interface AuthResponse {
  user: Omit<User, 'passwordHash'> & { company?: Company | null };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

// =====================================================
// CONFIGURATION
// =====================================================

const SALT_ROUNDS = 12;
const JWT_SECRET: string = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '24h';
const REFRESH_TOKEN_EXPIRES_IN: string = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

// =====================================================
// AUTH SERVICE
// =====================================================

export class AuthService {
  /**
   * Sign up a new user
   */
  async signup(data: SignupData): Promise<AuthResponse> {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      throw new Error('Un cont cu acest email există deja.');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    // Create user with company (if business account)
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        name: data.name,
        phone: data.phone,
        role: data.role,
        company: data.company
          ? {
              create: {
                legalName: data.company.name,
                cui: data.company.cui,
                address: data.company.address,
                city: data.company.city,
                county: data.company.county,
                postalCode: data.company.postalCode,
              },
            }
          : undefined,
      },
      include: { company: true },
    });

    // Generate JWT tokens
    const tokens = this.generateTokens(user.id);

    // Save session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  /**
   * Login existing user
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { company: true },
    });

    if (!user) {
      throw new Error('Email sau parolă incorectă.');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Email sau parolă incorectă.');
    }

    // Generate tokens
    const tokens = this.generateTokens(user.id);

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  /**
   * Logout user (invalidate session)
   */
  async logout(token: string): Promise<void> {
    try {
      await prisma.session.delete({
        where: { token },
      });
    } catch (error) {
      // Session might already be deleted, ignore error
      console.log('Session not found or already deleted');
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(oldRefreshToken: string): Promise<AuthResponse> {
    const session = await prisma.session.findUnique({
      where: { refreshToken: oldRefreshToken },
      include: { user: { include: { company: true } } },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    // Generate new tokens
    const tokens = this.generateTokens(session.userId);

    // Update session
    await prisma.session.update({
      where: { id: session.id },
      data: {
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: this.sanitizeUser(session.user),
      tokens,
    };
  }

  /**
   * Get user by ID (for authentication middleware)
   */
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { company: true },
    });

    if (!user) {
      return null;
    }

    return this.sanitizeUser(user);
  }

  /**
   * Verify session token
   */
  async verifySession(token: string) {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: { include: { company: true } } },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    return {
      session,
      user: this.sanitizeUser(session.user),
    };
  }

  /**
   * Generate JWT tokens
   */
  private generateTokens(userId: string) {
    const accessToken = jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });

    const refreshToken = jwt.sign({ userId, type: 'refresh' }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });

    return { accessToken, refreshToken };
  }

  /**
   * Remove password hash from user object
   */
  private sanitizeUser(user: User & { company?: Company | null }) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}

// Export singleton instance
export const authService = new AuthService();
