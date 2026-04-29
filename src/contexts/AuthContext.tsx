"use client";

import { StoredUser, User } from '@/types';
import { readStorage, writeStorage } from '@/utils/localStorageUtils';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => { success: boolean; message?: string; role?: 'user' | 'admin' };
  register: (name: string, email: string, password: string, profilePicture?: string) => { success: boolean; message?: string };
  updateProfile: (name: string, profilePicture?: string) => { success: boolean; message?: string };
  logout: () => void;
}

const defaultUsers: StoredUser[] = [
  { email: 'admin@mobilelibrary.com', password: 'Admin@2025', name: 'Admin', role: 'admin', registeredAt: '2025-01-01' },
  { email: 'user@example.com', password: 'password123', name: 'Demo User', role: 'user', registeredAt: '2025-01-01' }
];

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = readStorage<StoredUser[]>('mobile-library-users', []);
    const merged = [...defaultUsers];
    for (const u of stored) {
      if (!merged.some((d) => d.email === u.email)) {
        merged.push(u);
      }
    }
    writeStorage('mobile-library-users', merged);

    const savedUser = readStorage<User | null>('mobile-library-user', null);
    if (savedUser) {
      const match = merged.find((u) => u.email === savedUser.email);
      if (match) {
        const refreshed: User = { 
          email: match.email, 
          name: match.name, 
          role: match.role, 
          registeredAt: match.registeredAt,
          profilePicture: match.profilePicture 
        };
        setUser(refreshed);
        writeStorage('mobile-library-user', refreshed);
      }
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAdmin: user?.role === 'admin',
      login: (email, password) => {
        const users = readStorage<StoredUser[]>('mobile-library-users', defaultUsers);
        const found = users.find((item) => item.email === email && item.password === password);
        if (!found) return { success: false, message: 'Invalid credentials' };
        const nextUser: User = { 
          email: found.email, 
          name: found.name, 
          role: found.role, 
          registeredAt: found.registeredAt,
          profilePicture: found.profilePicture 
        };
        writeStorage('mobile-library-user', nextUser);
        setUser(nextUser);
        return { success: true, role: found.role };
      },
      register: (name, email, password, profilePicture) => {
        if (password.length < 6) {
          return { success: false, message: 'Password must be at least 6 characters' };
        }

        const users = readStorage<StoredUser[]>('mobile-library-users', defaultUsers);
        if (users.some((item) => item.email === email)) {
          return { success: false, message: 'Email already exists' };
        }

        const newUser: StoredUser = { 
          email, 
          password, 
          name, 
          role: 'user', 
          registeredAt: new Date().toISOString().split('T')[0],
          profilePicture 
        };
        writeStorage('mobile-library-users', [...users, newUser]);
        
        const nextUser: User = { 
          email, 
          name, 
          role: 'user', 
          registeredAt: newUser.registeredAt,
          profilePicture
        };
        writeStorage('mobile-library-user', nextUser);
        setUser(nextUser);
        return { success: true };
      },
      updateProfile: (name, profilePicture) => {
        if (!user) return { success: false, message: 'Not logged in' };
        
        const users = readStorage<StoredUser[]>('mobile-library-users', defaultUsers);
        const updatedUsers = users.map(u => {
          if (u.email === user.email) {
            return { ...u, name, profilePicture: profilePicture || u.profilePicture };
          }
          return u;
        });
        
        writeStorage('mobile-library-users', updatedUsers);
        
        const nextUser: User = { ...user, name, profilePicture: profilePicture || user.profilePicture };
        writeStorage('mobile-library-user', nextUser);
        setUser(nextUser);
        
        return { success: true };
      },
      logout: () => {
        window.localStorage.removeItem('mobile-library-user');
        setUser(null);
      }
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
