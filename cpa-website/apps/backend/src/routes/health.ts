import type { Express, Request, Response } from 'express';

export const registerHealthRoute = (app: Express): void => {
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });
};
