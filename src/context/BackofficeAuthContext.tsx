import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { BackofficeUser } from '@/types/backoffice';
import * as backofficeApi from '@/lib/api/backoffice';

// =====================================================
// BACKOFFICE AUTH CONTEXT INTERFACE
// =====================================================

interface BackofficeAuthContextType {
  user: BackofficeUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const BackofficeAuthContext = createContext<BackofficeAuthContextType | undefined>(undefined);

// =====================================================
// BACKOFFICE AUTH PROVIDER
// =====================================================

export const BackofficeAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<BackofficeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from session on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const currentUser = backofficeApi.getBackofficeUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to load backoffice user from session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login user
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await backofficeApi.backofficeLogin({ email, password });
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  }, []);

  // Logout user
  const logout = useCallback(async () => {
    try {
      await backofficeApi.backofficeLogout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    }
  }, []);

  const isAuthenticated = user !== null;

  const value: BackofficeAuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <BackofficeAuthContext.Provider value={value}>{children}</BackofficeAuthContext.Provider>;
};

// =====================================================
// CUSTOM HOOK
// =====================================================

export const useBackofficeAuth = (): BackofficeAuthContextType => {
  const context = useContext(BackofficeAuthContext);
  if (context === undefined) {
    throw new Error('useBackofficeAuth must be used within a BackofficeAuthProvider');
  }
  return context;
};
