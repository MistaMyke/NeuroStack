import { z } from 'zod';

export const contactRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z
    .string()
    .min(7)
    .max(40)
    .regex(/^[+\d()\-\s]*$/)
    .optional(),
  reason: z.string().max(120).optional(),
  message: z.string().min(10),
});

export type ContactRequest = z.infer<typeof contactRequestSchema>;
