import type { Express, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

import { prisma } from '@db/prismaClient';
import { requireDemoMode, requireDemoUser } from '@middleware/demoAuth';
import { createStorageService } from '@services/storage/S3Storage';

const storage = createStorageService();

const sanitizeFilename = (name: string): string =>
  name.replace(/[^a-zA-Z0-9._-]/g, '_');

const buildStorageKey = (engagementId: string, filename: string): string =>
  `engagements/${engagementId}/${Date.now()}-${sanitizeFilename(filename)}`;

const parseSize = (value: unknown): number | null => {
  const size = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(size)) {
    return null;
  }
  return size;
};

const MAX_FILE_BYTES = 100 * 1024 * 1024;

export const registerPortalRoute = (app: Express): void => {
  app.get('/portal/engagements', requireDemoMode, requireDemoUser(), async (_req: Request, res: Response) => {
    const user = res.locals.demoUser;
    if (!user) {
      return res.status(401).json({ error: 'unauthenticated' });
    }

    const where =
      user.role === 'staff'
        ? {}
        : {
            clientId: user.id,
          };

    const engagements = await prisma.engagement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        taxYear: true,
        notes: true,
        createdAt: true,
      },
    });

    return res.json({ engagements });
  });

  app.get(
    '/portal/engagements/:id/documents',
    requireDemoMode,
    requireDemoUser(),
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const user = res.locals.demoUser;
      if (!user) {
        return res.status(401).json({ error: 'unauthenticated' });
      }

      const engagement = await prisma.engagement.findUnique({ where: { id } });
      if (!engagement) {
        return res.status(404).json({ error: 'not_found' });
      }

      if (user.role === 'client' && engagement.clientId !== user.id) {
        return res.status(403).json({ error: 'forbidden' });
      }

      const documents = await prisma.document.findMany({
        where: { engagementId: id },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          filename: true,
          mimeType: true,
          size: true,
          status: true,
          createdAt: true,
        },
      });

      return res.json({ documents });
    },
  );

  app.post(
    '/portal/engagements/:id/documents/presign',
    requireDemoMode,
    requireDemoUser(),
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const user = res.locals.demoUser;
      if (!user) {
        return res.status(401).json({ error: 'unauthenticated' });
      }

      const engagement = await prisma.engagement.findUnique({ where: { id } });
      if (!engagement) {
        return res.status(404).json({ error: 'not_found' });
      }

      if (user.role === 'client' && engagement.clientId !== user.id) {
        return res.status(403).json({ error: 'forbidden' });
      }

      const filename = typeof req.body?.filename === 'string' ? req.body.filename : null;
      const mimeType = typeof req.body?.mimeType === 'string' ? req.body.mimeType : 'application/octet-stream';
      const size = parseSize(req.body?.size);

      if (!filename || size === null) {
        return res.status(400).json({ error: 'invalid_request' });
      }

      if (size > MAX_FILE_BYTES) {
        return res.status(400).json({ error: 'file_too_large' });
      }

      const storageKey = buildStorageKey(id, filename);
      const presigned = await storage.createPresignedUpload(storageKey, mimeType);

      const document = await prisma.document.create({
        data: {
          engagementId: id,
          uploaderId: user.id,
          filename,
          mimeType,
          size,
          storageKey,
          status: 'PENDING',
        },
      });

      return res.json({
        uploadUrl: presigned.url,
        documentId: document.id,
      });
    },
  );

  app.post(
    '/portal/documents/:id/confirm',
    requireDemoMode,
    requireDemoUser(),
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const user = res.locals.demoUser;
      if (!user) {
        return res.status(401).json({ error: 'unauthenticated' });
      }

      const document = await prisma.document.findUnique({
        where: { id },
        include: { engagement: true },
      });

      if (!document) {
        return res.status(404).json({ error: 'not_found' });
      }

      if (user.role === 'client' && document.engagement.clientId !== user.id) {
        return res.status(403).json({ error: 'forbidden' });
      }

      const updated = await prisma.document.update({
        where: { id },
        data: { status: 'AVAILABLE' },
      });

      return res.json({ status: updated.status });
    },
  );

  app.get(
    '/portal/documents/:id/download',
    requireDemoMode,
    requireDemoUser(),
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const user = res.locals.demoUser;
      if (!user) {
        return res.status(401).json({ error: 'unauthenticated' });
      }

      const document = await prisma.document.findUnique({
        where: { id },
        include: { engagement: true },
      });

      if (!document) {
        return res.status(404).json({ error: 'not_found' });
      }

      if (user.role === 'client' && document.engagement.clientId !== user.id) {
        return res.status(403).json({ error: 'forbidden' });
      }

      const presigned = await storage.createPresignedDownload(document.storageKey);
      return res.json({ downloadUrl: presigned.url });
    },
  );

  app.post('/payments/mock/create', requireDemoMode, requireDemoUser(), async (req: Request, res: Response) => {
    const user = res.locals.demoUser;
    if (!user) {
      return res.status(401).json({ error: 'unauthenticated' });
    }

    const amount = parseSize(req.body?.amount);
    const engagementId = typeof req.body?.engagementId === 'string' ? req.body.engagementId : undefined;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'invalid_amount' });
    }

    let clientId = user.id;

    if (engagementId) {
      const engagement = await prisma.engagement.findUnique({ where: { id: engagementId } });
      if (!engagement) {
        return res.status(404).json({ error: 'not_found' });
      }
      clientId = engagement.clientId;
    }

    const payment = await prisma.paymentRecord.create({
      data: {
        clientId,
        engagementId,
        provider: 'mock',
        amount,
        status: 'PENDING',
        externalRef: randomUUID(),
      },
    });

    return res.json({ paymentId: payment.id, status: payment.status });
  });

  app.post('/payments/mock/complete', requireDemoMode, requireDemoUser(), async (req: Request, res: Response) => {
    const { paymentId, status } = req.body ?? {};

    if (typeof paymentId !== 'string' || !paymentId) {
      return res.status(400).json({ error: 'invalid_payment' });
    }

    const normalized = typeof status === 'string' ? status.toUpperCase() : 'PAID';
    const finalStatus = normalized === 'FAILED' ? 'FAILED' : 'PAID';

    try {
      const payment = await prisma.paymentRecord.update({
        where: { id: paymentId },
        data: { status: finalStatus },
      });

      return res.json({ paymentId: payment.id, status: payment.status });
    } catch (error) {
      return res.status(404).json({ error: 'not_found' });
    }
  });
};
