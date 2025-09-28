"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactRequestSchema = void 0;
const zod_1 = require("zod");
exports.contactRequestSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    phone: zod_1.z
        .string()
        .min(7)
        .max(40)
        .regex(/^[+\d()\-\s]*$/)
        .optional(),
    reason: zod_1.z.string().max(120).optional(),
    message: zod_1.z.string().min(10),
});
//# sourceMappingURL=index.js.map