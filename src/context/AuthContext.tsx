'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
}

interface AuthContextType {
  user: User | null;
  adminUser: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setAdminUser: (admin: User | null) => void;
  logoutCustomer: () => Promise<void>;
  logoutAdmin: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = async () => {
    try {
      // Check customer session
      const resUser = await fetch('/api/auth/me');
      if (resUser.ok) {
        const data = await resUser.json();
        setUser(data.user || null);
      } else {
        setUser(null);
      }

      // Check admin session
      const resAdmin = await fetch('/api/admin/auth/me');
      if (resAdmin.ok) {
        const data = await resAdmin.json();
        setAdminUser(data.admin || null);
      } else {
        setAdminUser(null);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const logoutCustomer = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch {
      // ignore
    }
  };

  const logoutAdmin = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      setAdminUser(null);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminUser,
        isLoading,
        setUser,
        setAdminUser,
        logoutCustomer,
        logoutAdmin,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

