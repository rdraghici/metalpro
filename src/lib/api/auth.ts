/**
 * Authentication API
 *
 * Mock implementation using localStorage
 * Replace with real backend API calls when ready
 */

import type { User, SignupData, LoginData, AuthResponse } from '@/types/user';
import { validateCUI } from '@/lib/validation/cuiValidator';

const STORAGE_KEY = 'metalpro_users';
const SESSION_KEY = 'metalpro_session';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get all users from localStorage (mock database)
 */
function getUsers(): User[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save users to localStorage
 */
function saveUsers(users: User[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

/**
 * Get current session
 */
function getSession(): AuthResponse | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Save session
 */
function saveSession(session: AuthResponse): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Clear session
 */
function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Check if email is already registered
 */
export async function checkEmailAvailability(email: string): Promise<boolean> {
  await delay(300); // Simulate network
  const users = getUsers();
  return !users.some((u) => u.email.toLowerCase() === email.toLowerCase());
}

/**
 * Sign up new user
 */
export async function signup(data: SignupData): Promise<AuthResponse> {
  await delay(500); // Simulate network

  // Validate email availability
  const isAvailable = await checkEmailAvailability(data.email);
  if (!isAvailable) {
    throw new Error('Un cont cu acest email există deja.');
  }

  // Validate CUI if provided
  if (data.company?.cui) {
    const cuiValidation = validateCUI(data.company.cui);
    if (!cuiValidation.valid) {
      throw new Error(cuiValidation.message || 'CUI invalid');
    }
  }

  // Create new user
  const newUser: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    email: data.email,
    name: data.name,
    phone: data.phone,
    role: data.role,
    company: data.company,
    emailVerified: false, // In real system, would send verification email
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Save to "database"
  const users = getUsers();
  users.push(newUser);
  saveUsers(users);

  // Create session
  const authResponse: AuthResponse = {
    user: newUser,
    tokens: {
      accessToken: `mock_token_${newUser.id}`,
    },
  };

  saveSession(authResponse);

  return authResponse;
}

/**
 * Login existing user
 */
export async function login(data: LoginData): Promise<AuthResponse> {
  await delay(500); // Simulate network

  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());

  if (!user) {
    throw new Error('Email sau parolă incorectă.');
  }

  // In real system, would verify password hash
  // For mock, we just accept any password

  // Create session
  const authResponse: AuthResponse = {
    user,
    tokens: {
      accessToken: `mock_token_${user.id}`,
    },
  };

  saveSession(authResponse);

  return authResponse;
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
  await delay(200); // Simulate network
  clearSession();
}

/**
 * Get current user from session
 */
export function getCurrentUser(): User | null {
  const session = getSession();
  return session?.user || null;
}

/**
 * Refresh authentication token
 */
export async function refreshToken(): Promise<AuthResponse> {
  await delay(300); // Simulate network

  const session = getSession();
  if (!session) {
    throw new Error('No active session');
  }

  // In real system, would validate refresh token and issue new access token
  // For mock, just return existing session
  return session;
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<void> {
  await delay(500); // Simulate network

  const users = getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    // Don't reveal if email exists (security best practice)
    // Just return success
    return;
  }

  // In real system, would send password reset email
  console.log(`Password reset email would be sent to: ${email}`);
}

/**
 * Update user profile
 */
export async function updateProfile(userId: string, updates: Partial<User>): Promise<User> {
  await delay(500); // Simulate network

  const users = getUsers();
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    throw new Error('User not found');
  }

  // Update user
  const updatedUser = {
    ...users[userIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  users[userIndex] = updatedUser;
  saveUsers(users);

  // Update session
  const session = getSession();
  if (session && session.user.id === userId) {
    session.user = updatedUser;
    saveSession(session);
  }

  return updatedUser;
}
