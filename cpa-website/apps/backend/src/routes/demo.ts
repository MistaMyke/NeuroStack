import type { Express, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

import { prisma } from '@db/prismaClient';
import { requireDemoMode } from '@middleware/demoAuth';
import {
  createDemoSession,
  demoCookie,
  type DemoRole,
  type DemoUser,
} from '@services/demo/DemoSession';

const resolveRole = (value: unknown): DemoRole | null => {
  if (value === 'client' || value === 'staff') {
    return value;
  }
  return null;
};

const roleToName = (role: DemoRole): string =>
  role === 'staff' ? 'Demo Staff' : 'Demo Client';

const roleToEmail = (role: DemoRole): string =>
  role === 'staff' ? 'demo.staff@vhtax.local' : 'demo.client@vhtax.local';

const upsertDemoUser = async (role: DemoRole): Promise<DemoUser> => {
  const email = roleToEmail(role);
  const name = roleToName(role);
  const user = await prisma.user.upsert({
    where: { email },
    update: { name, role: role.toUpperCase() as 'CLIENT' | 'STAFF' },
    create: { email, name, role: role.toUpperCase() as 'CLIENT' | 'STAFF' },
  });

  return {
    id: user.id,
    role,
    email: user.email,
    name: user.name,
  };
};

const ensureSeedData = async () => {
  const clientUser = await upsertDemoUser('client');
  await upsertDemoUser('staff');

  const engagement = await prisma.engagement.findFirst({
    where: { clientId: clientUser.id },
  });

  if (!engagement) {
    await prisma.engagement.create({
      data: {
        clientId: clientUser.id,
        status: 'RECEIVED',
        taxYear: new Date().getFullYear(),
        notes: 'Demo engagement for portal preview.',
      },
    });
  }

  return clientUser;
};

export const registerDemoRoute = (app: Express): void => {
  app.post('/demo/login', requireDemoMode, async (req: Request, res: Response) => {
    const role = resolveRole(req.body?.role);

    if (!role) {
      return res.status(400).json({ error: 'invalid_role' });
    }

    try {
      const user = await upsertDemoUser(role);
      const session = createDemoSession(user);

      res.setHeader('Set-Cookie', demoCookie(session.sessionId));
      return res.json({ user });
    } catch (error) {
      return res.status(500).json({ error: 'unable_to_login' });
    }
  });

  app.get('/demo/me', requireDemoMode, (req: Request, res: Response) => {
    const sessionCookie = req.headers.cookie;
    if (!sessionCookie) {
      return res.status(401).json({ error: 'unauthenticated' });
    }

    // demoSessionMiddleware will already populate res.locals
    const user = res.locals.demoUser;
    if (!user) {
      return res.status(401).json({ error: 'unauthenticated' });
    }

    return res.json({ user });
  });

  app.post('/demo/seed', requireDemoMode, async (_req: Request, res: Response) => {
    try {
      await ensureSeedData();
      return res.json({ status: 'seeded', requestId: randomUUID() });
    } catch (error) {
      return res.status(500).json({ error: 'unable_to_seed' });
    }
  });
};
