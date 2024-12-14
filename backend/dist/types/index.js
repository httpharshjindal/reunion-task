"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authHeader = exports.createTaskBody = exports.signinBody = exports.signupBody = void 0;
const zod_1 = require("zod");
exports.signupBody = zod_1.z.object({
    username: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8)
});
exports.signinBody = zod_1.z.object({
    email: zod_1.z.string(),
    password: zod_1.z.string()
});
exports.createTaskBody = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    status: zod_1.z.string().optional(),
    startDate: zod_1.z.coerce.date(),
    endDate: zod_1.z.coerce.date(),
    priority: zod_1.z.number().min(1).max(5)
});
exports.authHeader = zod_1.z.string();
// export type signinBody = z.infer<typeof signinBody>
// export type signupBody = z.infer<typeof signupBody>
// export type updateTaskBody = z.infer<typeof updateTaskBody>
// export type createTaskBody = z.infer<typeof createTaskBody>
