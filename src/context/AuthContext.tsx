import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, SignupData, LoginData } from '@/types/user';
import * as authApi from '@/lib/api/auth';

// =====================================================
// AUTH CONTEXT INTERFACE
// =====================================================

interface AuthContextType {
  user: User | null; // null = guest user
  isAuthenticated: boolean; // false = guest
  isGuest: boolean; // true when user === null
  isLoading: boolean;

  // Actions
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;

  // Helper for upselling
  promptSignup: (context: 'bom_save' | 'rfq_success' | 'order_history') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =====================================================
// AUTH PROVIDER
// =====================================================

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [signupPromptContext, setSignupPromptContext] = useState<string | null>(null);

  // Load user from session on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const currentUser = authApi.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to load user from session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login user
  const login = useCallback(async (data: LoginData) => {
    try {
      const response = await authApi.login(data);
      setUser(response.user);
    } catch (error) {
      throw error; // Let the component handle the error
    }
  }, []);

  // Sign up new user
  const signup = useCallback(async (data: SignupData) => {
    try {
      const response = await authApi.signup(data);
      setUser(response.user);
    } catch (error) {
      throw error; // Let the component handle the error
    }
  }, []);

  // Logout user
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API fails, clear local user state
      setUser(null);
    }
  }, []);

  // Update user profile
  const updateUser = useCallback(
    async (updates: Partial<User>) => {
      if (!user) {
        throw new Error('No user logged in');
      }

      try {
        const updatedUser = await authApi.updateProfile(user.id, updates);
        setUser(updatedUser);
      } catch (error) {
        throw error;
      }
    },
    [user]
  );

  // Prompt signup (for analytics/upsell tracking)
  const promptSignup = useCallback((context: 'bom_save' | 'rfq_success' | 'order_history') => {
    setSignupPromptContext(context);
    // You could also trigger analytics event here
    console.log(`Signup prompt shown: ${context}`);
  }, []);

  const isAuthenticated = user !== null;
  const isGuest = user === null;

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isGuest,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    promptSignup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// =====================================================
// CUSTOM HOOK
// =====================================================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
