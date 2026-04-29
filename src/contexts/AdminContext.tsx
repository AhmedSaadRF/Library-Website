"use client";

import { useAuth } from '@/contexts/AuthContext';
import { createContext, ReactNode, useContext, useMemo } from 'react';

// AdminContext is now a thin wrapper over AuthContext.
// An "admin" is simply a logged-in user with role === 'admin'.
// The separate password-session system is removed in favour of real auth.

interface AdminContextValue {
  isAdmin: boolean;
  logoutAdmin: () => void;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { isAdmin, logout } = useAuth();

  const value = useMemo<AdminContextValue>(
    () => ({
      isAdmin,
      logoutAdmin: logout
    }),
    [isAdmin, logout]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
}
