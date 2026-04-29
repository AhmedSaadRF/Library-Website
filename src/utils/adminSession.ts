import { AdminSession } from '@/types';

const ADMIN_SESSION_KEY = 'mobile-library-admin-session';
const DEFAULT_DURATION_MS = 24 * 60 * 60 * 1000;

export function getAdminPassword() {
  return process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'admin123';
}

export function createAdminSession(durationMs = DEFAULT_DURATION_MS): AdminSession {
  return {
    token: `admin-${Date.now()}`,
    expiresAt: Date.now() + durationMs
  };
}

export function isAdminSessionValid(session: AdminSession | null) {
  return Boolean(session && session.expiresAt > Date.now() && session.token);
}

export function getAdminSessionKey() {
  return ADMIN_SESSION_KEY;
}
