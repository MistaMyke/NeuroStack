import { z } from 'zod';
export declare const contactRequestSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    message: string;
    phone?: string | undefined;
    reason?: string | undefined;
}, {
    name: string;
    email: string;
    message: string;
    phone?: string | undefined;
    reason?: string | undefined;
}>;
export type ContactRequest = z.infer<typeof contactRequestSchema>;
