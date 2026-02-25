import { z } from 'zod';

export const aiChatRequestSchema = z.object({
  message: z.string().min(2).max(2000),
  channel: z.enum(['public', 'portal']).default('public'),
  sessionId: z.string().optional(),
});

export type AiChatRequest = z.infer<typeof aiChatRequestSchema>;

export const aiTicketRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10).max(4000),
  channel: z.enum(['public', 'portal']).optional(),
  sessionId: z.string().optional(),
});

export type AiTicketRequest = z.infer<typeof aiTicketRequestSchema>;

export type AiChatResponse = {
  reply: string;
  source: 'faq' | 'fallback' | 'pii' | 'ai';
  needsEscalation: boolean;
};
