import type { Express, NextFunction, Request, Response } from 'express';

import type { ContactStatus } from '@services/contact/ContactService';
import {
  addContactRequestNote,
  listContactRequests,
  updateContactRequestStatus,
} from '@services/contact/StaffContactService';

const loadStaffConfig = () => {
  const accessCode = process.env.STAFF_ACCESS_CODE ?? '';
  const emails = (process.env.STAFF_ALLOWED_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return {
    accessCode,
    emails,
  };
};

const createGuard = () => {
  const { accessCode, emails } = loadStaffConfig();

  return (req: Request, res: Response, next: NextFunction) => {
    const emailHeader = req.header('x-staff-email') ?? '';
    const accessHeader = req.header('x-staff-access') ?? '';
    const normalizedEmail = emailHeader.trim().toLowerCase();

    if (!accessCode || emails.length === 0) {
      return res.status(503).json({ error: 'staff_not_configured' });
    }

    if (!emails.includes(normalizedEmail) || accessHeader !== accessCode) {
      return res.status(403).json({ error: 'unauthorized' });
    }

    res.locals.staffEmail = normalizedEmail;
    return next();
  };
};

const parseStatusQuery = (value: unknown): ContactStatus | 'ALL' => {
  if (typeof value !== 'string' || value.length === 0) {
    return 'ALL';
  }

  const upper = value.toUpperCase();
  if (upper === 'ALL') {
    return 'ALL';
  }

  if (['RECEIVED', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'].includes(upper)) {
    return upper as ContactStatus;
  }

  return 'ALL';
};

export const registerStaffRoute = (app: Express): void => {
  const guard = createGuard();

  app.get('/staff/contact-requests', guard, async (req: Request, res: Response) => {
    const status = parseStatusQuery(req.query.status);

    const results = await listContactRequests({ status });
    return res.json({ results });
  });

  app.patch('/staff/contact-requests/:id', guard, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body ?? {};

    const parsedStatus = parseStatusQuery(status);
    if (parsedStatus === 'ALL') {
      return res.status(400).json({ error: 'invalid_status' });
    }

    try {
      const updated = await updateContactRequestStatus(id, parsedStatus);
      return res.json({ status: updated.status });
    } catch (error) {
      return res.status(404).json({ error: 'not_found' });
    }
  });

  app.post('/staff/contact-requests/:id/notes', guard, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { body } = req.body ?? {};
    const staffEmail: string = res.locals.staffEmail;

    if (!body || typeof body !== 'string' || body.trim().length < 2) {
      return res.status(400).json({ error: 'invalid_note' });
    }

    try {
      const note = await addContactRequestNote(id, staffEmail, body.trim());
      return res.status(201).json({ note });
    } catch (error) {
      return res.status(404).json({ error: 'not_found' });
    }
  });
};
