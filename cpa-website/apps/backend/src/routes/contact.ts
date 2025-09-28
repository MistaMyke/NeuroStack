import { contactRequestSchema } from '@cpa/shared-types';
import type { Express, Request, Response } from 'express';

import {
  createContactService,
  type ContactService,
} from '@services/contact/ContactService';
import {
  createEmailNotifier,
  type ContactNotifier,
  NoOpNotifier,
} from '@services/notifications/EmailNotifier';

type ContactRouteDependencies = {
  contactService?: ContactService;
  notifier?: ContactNotifier;
};

export const registerContactRoute = (
  app: Express,
  {
    contactService = createContactService(),
    notifier = createEmailNotifier() ?? new NoOpNotifier(),
  }: ContactRouteDependencies = {},
): void => {
  app.post('/contact', async (req: Request, res: Response) => {
    const result = contactRequestSchema.safeParse(req.body);

    if (!result.success) {
      const { fieldErrors, formErrors } = result.error.flatten();

      return res.status(400).json({
        error: 'invalid_request',
        fieldErrors,
        formErrors,
      });
    }

    try {
      const submission = await contactService.submitRequest(result.data);

      try {
        await notifier.sendNewContactNotification(submission);
      } catch (notificationError) {
        // eslint-disable-next-line no-console
        console.error('Failed to send contact notification', notificationError);
      }

      return res.status(202).json({ status: 'received' });
    } catch (error) {
      return res.status(500).json({ error: 'unable_to_process' });
    }
  });
};
