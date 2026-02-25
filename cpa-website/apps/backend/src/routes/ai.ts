import type { Express, Request, Response } from 'express';

import { createContactService, type ContactService } from '@services/contact/ContactService';
import {
  createEmailNotifier,
  type ContactNotifier,
  NoOpNotifier,
} from '@services/notifications/EmailNotifier';
import { createAiService, type AiService } from '@services/ai/AiService';
import { aiChatRequestSchema, aiTicketRequestSchema } from '@services/ai/aiSchemas';

const buildTicketMessage = (message: string, channel?: string, sessionId?: string): string => {
  const lines = [
    'AI chat escalation:',
    `Channel: ${channel ?? 'public'}`,
    `Session: ${sessionId ?? 'not_provided'}`,
    '',
    'Client message:',
    message,
  ];

  return lines.join('\n');
};

type AiRouteDependencies = {
  aiService?: AiService;
  contactService?: ContactService;
  notifier?: ContactNotifier;
};

export const registerAiRoute = (
  app: Express,
  {
    aiService = createAiService(),
    contactService = createContactService(),
    notifier = createEmailNotifier() ?? new NoOpNotifier(),
  }: AiRouteDependencies = {},
): void => {
  app.post('/ai/chat', async (req: Request, res: Response) => {
    const result = aiChatRequestSchema.safeParse(req.body);

    if (!result.success) {
      const { fieldErrors, formErrors } = result.error.flatten();

      return res.status(400).json({
        error: 'invalid_request',
        fieldErrors,
        formErrors,
      });
    }

    try {
      const response = await aiService.respond(result.data);
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ error: 'unable_to_process' });
    }
  });

  app.post('/ai/ticket', async (req: Request, res: Response) => {
    const result = aiTicketRequestSchema.safeParse(req.body);

    if (!result.success) {
      const { fieldErrors, formErrors } = result.error.flatten();

      return res.status(400).json({
        error: 'invalid_request',
        fieldErrors,
        formErrors,
      });
    }

    const payload = result.data;

    try {
      const submission = await contactService.submitRequest({
        name: payload.name,
        email: payload.email,
        phone: undefined,
        reason: 'AI Chat',
        message: buildTicketMessage(payload.message, payload.channel, payload.sessionId),
      });

      try {
        await notifier.sendNewContactNotification(submission);
      } catch (notificationError) {
        // eslint-disable-next-line no-console
        console.error('Failed to send AI ticket notification', notificationError);
      }

      return res.status(201).json({ status: 'received' });
    } catch (error) {
      return res.status(500).json({ error: 'unable_to_process' });
    }
  });
};
