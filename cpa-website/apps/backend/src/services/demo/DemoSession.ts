import { randomUUID } from 'node:crypto';

import { parseCookies } from '@utils/cookies';

export type DemoRole = 'client' | 'staff';

export type DemoUser = {
  id: string;
  role: DemoRole;
  email: string;
  name: string;
};

type DemoSession = DemoUser & {
  sessionId: string;
};

const sessions = new Map<string, DemoSession>();
const COOKIE_NAME = 'demo_session';

export const isDemoMode = (): boolean => process.env.DEMO_MODE === 'true';

export const createDemoSession = (user: DemoUser): DemoSession => {
  const sessionId = randomUUID();
  const session: DemoSession = {
    ...user,
    sessionId,
  };

  sessions.set(sessionId, session);
  return session;
};

export const getDemoSession = (cookieHeader?: string): DemoSession | null => {
  const cookies = parseCookies(cookieHeader);
  const sessionId = cookies[COOKIE_NAME];

  if (!sessionId) {
    return null;
  }

  return sessions.get(sessionId) ?? null;
};

export const clearDemoSession = (sessionId: string): void => {
  sessions.delete(sessionId);
};

export const demoCookie = (sessionId: string): string => {
  const maxAgeSeconds = 60 * 60 * 8;
  return `${COOKIE_NAME}=${encodeURIComponent(
    sessionId,
  )}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}`;
};
