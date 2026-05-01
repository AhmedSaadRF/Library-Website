"use client";

import { StoredUser, User } from '@/types';
import { readStorage, writeStorage } from '@/utils/localStorageUtils';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';

interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  totalUsers: number; // NEW
  login: (email: string, password: string) => { success: boolean; message?: string; role?: 'user' | 'admin' };
  register: (name: string, email: string, password: string, profilePicture?: string) => { success: boolean; message?: string };
  updateProfile: (name: string, profilePicture?: string) => { success: boolean; message?: string };
  updateProfilePicture: (profilePicture: string | null) => Promise<{ success: boolean; message?: string }>;
  updateUserDetails: (name: string, email: string, profilePicture: string | null, oldPassword: string) => Promise<{ success: boolean; message?: string }>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);

  const getUsers = (): StoredUser[] => {
    let users = readStorage<StoredUser[]>('mobile-library-users', []);
    const adminEmail = 'ofoq@gmail.com';
    const adminExists = users.some(u => u.email === adminEmail);
    
    if (!adminExists) {
      users = users.filter(u => u.role !== 'admin');
      const newAdmin: StoredUser = {
        id: uuid(),
        email: adminEmail,
        password: 'Ofoq2026',
        name: 'Ofoq Admin',
        role: 'admin',
        registeredAt: '2026-05-06',
        profilePicture: '/images/logo.png',
      };
      users = [newAdmin, ...users];
    }

    const demoEmail = 'user@example.com';
    if (!users.some(u => u.email === demoEmail)) {
      const demoUser: StoredUser = {
        id: uuid(),
        email: demoEmail,
        password: 'password123',
        name: 'Demo User',
        role: 'user',
        registeredAt: '2026-05-06',
        profilePicture: null,
      };
      users.push(demoUser);
    }

    writeStorage('mobile-library-users', users);
    return users;
  };

  const updateTotalUsers = () => {
    const users = getUsers();
    setTotalUsers(users.length);
  };

  useEffect(() => {
    const users = getUsers();
    setTotalUsers(users.length);

    const savedUser = readStorage<User | null>('mobile-library-user', null);
    if (savedUser) {
      const match = users.find(u => u.id === savedUser.id);
      if (match) {
        const refreshed: User = {
          id: match.id,
          email: match.email,
          name: match.name,
          role: match.role,
          registeredAt: match.registeredAt,
          profilePicture: match.profilePicture,
        };
        setUser(refreshed);
        writeStorage('mobile-library-user', refreshed);
      }
    }
  }, []);

  const login = (email: string, password: string) => {
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, message: 'Invalid credentials' };
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    writeStorage('mobile-library-user', safeUser);
    updateTotalUsers();
    return { success: true, role: found.role };
  };

  const register = (name: string, email: string, password: string, profilePicture?: string) => {
    if (password.length < 6) return { success: false, message: 'Password must be at least 6 characters' };
    const users = getUsers();
    if (users.some(u => u.email === email)) return { success: false, message: 'Email already exists' };
    const newUser: StoredUser = {
      id: uuid(),
      email,
      password,
      name,
      role: 'user',
      registeredAt: new Date().toISOString().split('T')[0],
      profilePicture: profilePicture || null,
    };
    writeStorage('mobile-library-users', [...users, newUser]);
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    writeStorage('mobile-library-user', safeUser);
    updateTotalUsers();
    return { success: true };
  };

  const updateProfile = (name: string, profilePicture?: string) => {
    if (!user) return { success: false, message: 'Not logged in' };
    const users = getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index === -1) return { success: false, message: 'User not found' };
    users[index].name = name;
    if (profilePicture !== undefined) users[index].profilePicture = profilePicture;
    writeStorage('mobile-library-users', users);
    const updatedUser = { ...user, name, profilePicture: profilePicture ?? user.profilePicture };
    setUser(updatedUser);
    writeStorage('mobile-library-user', updatedUser);
    updateTotalUsers();
    return { success: true };
  };

  const updateProfilePicture = async (profilePicture: string | null) => {
    if (!user) return { success: false, message: 'Not logged in' };
    const users = getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index === -1) return { success: false, message: 'User not found' };
    users[index].profilePicture = profilePicture;
    writeStorage('mobile-library-users', users);
    const updatedUser = { ...user, profilePicture };
    setUser(updatedUser);
    writeStorage('mobile-library-user', updatedUser);
    updateTotalUsers();
    return { success: true };
  };

  const updateUserDetails = async (name: string, email: string, profilePicture: string | null, oldPassword: string) => {
    if (!user) return { success: false, message: 'Not logged in' };
    const users = getUsers();
    const currentUser = users.find(u => u.id === user.id);
    if (!currentUser) return { success: false, message: 'User not found' };
    if (currentUser.password !== oldPassword) return { success: false, message: 'Incorrect old password' };
    if (email !== user.email && users.some(u => u.email === email && u.id !== user.id)) {
      return { success: false, message: 'Email already taken by another user' };
    }
    currentUser.name = name;
    currentUser.email = email;
    if (profilePicture !== undefined) currentUser.profilePicture = profilePicture;
    writeStorage('mobile-library-users', users);
    const { password: _, ...safeUser } = currentUser;
    setUser(safeUser);
    writeStorage('mobile-library-user', safeUser);
    updateTotalUsers();
    return { success: true };
  };

  const updatePassword = async (oldPassword: string, newPassword: string) => {
    if (!user) return { success: false, message: 'Not logged in' };
    if (newPassword.length < 6) return { success: false, message: 'Password must be at least 6 characters' };
    const users = getUsers();
    const currentUser = users.find(u => u.id === user.id);
    if (!currentUser) return { success: false, message: 'User not found' };
    if (currentUser.password !== oldPassword) return { success: false, message: 'Incorrect old password' };
    currentUser.password = newPassword;
    writeStorage('mobile-library-users', users);
    updateTotalUsers();
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('mobile-library-user');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  const value = useMemo(
    () => ({
      user,
      isAdmin,
      totalUsers,
      login,
      register,
      updateProfile,
      updateProfilePicture,
      updateUserDetails,
      updatePassword,
      logout,
    }),
    [user, totalUsers]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}