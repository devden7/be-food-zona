import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly REGISTER_USER: ZodType = z
    .object({
      username: z.string().min(1).max(20),
      name: z.string().min(1).max(50),
      password: z.string().min(6).max(20),
    })
    .refine((value) => !value.username.includes(' '), {
      message: 'Please avoid using spaces in this input.',
      path: ['username'],
    });

  static readonly LOGIN_USER: ZodType = z
    .object({
      username: z.string().min(1).max(20),
      password: z.string().min(6).max(20),
    })
    .refine((value) => !value.username.includes(' '), {
      message: 'Please avoid using spaces in this input.',
      path: ['username'],
    });
}
