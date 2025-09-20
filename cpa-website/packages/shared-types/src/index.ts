import { z } from 'zod';

export const contactRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10)
});

export type ContactRequest = z.infer<typeof contactRequestSchema>;
