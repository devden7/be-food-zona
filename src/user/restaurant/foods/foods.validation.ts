import { z, ZodType } from 'zod';

export class ProductsValidaton {
  static readonly CREATE_FORM_PRODUCT: ZodType = z.object({
    foodName: z.string().min(1).max(150),
    description: z.string().min(1).max(250),
    price: z.number().gte(1000).lte(1000000),
    category: z.string().min(1).max(150),
  });
}
