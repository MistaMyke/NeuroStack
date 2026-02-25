import type { NextFunction, Request, Response } from 'express';

import { getDemoSession, isDemoMode, type DemoRole, type DemoUser } from '@services/demo/DemoSession';

declare module 'express-serve-static-core' {
  interface Response {
    locals: {
      demoUser?: DemoUser;
      [key: string]: unknown;
    };
  }
}

export const demoSessionMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (!isDemoMode()) {
    return next();
  }

  const session = getDemoSession(req.headers.cookie);
  if (session) {
    res.locals.demoUser = session;
  }

  return next();
};

export const requireDemoMode = (req: Request, res: Response, next: NextFunction): void => {
  if (!isDemoMode()) {
    res.status(404).json({ error: 'not_available' });
    return;
  }

  next();
};

export const requireDemoUser =
  (roles?: DemoRole[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const user = res.locals.demoUser;

    if (!user) {
      res.status(401).json({ error: 'unauthenticated' });
      return;
    }

    if (roles && !roles.includes(user.role)) {
      res.status(403).json({ error: 'forbidden' });
      return;
    }

    next();
  };
