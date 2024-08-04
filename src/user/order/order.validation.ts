import { z, ZodType } from 'zod';

export class OrderValidation {
  static readonly FORM_REVIEW: ZodType = z.object({
    rating: z
      .number()
      .int()
      .gte(1, { message: 'Silahkan masukan rating' })
      .lte(5, { message: 'Silahkan masukan rating' }),
    comment: z
      .string()
      .min(3, { message: 'Silakan masukan tanggapan' })
      .max(250, { message: 'Silakan masukan tanggapan' }),
  });
}
