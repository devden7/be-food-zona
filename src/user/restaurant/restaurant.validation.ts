import { z, ZodType } from 'zod';

export class RestaurantValidation {
  static readonly REGISTER_RESTAURANT: ZodType = z.object({
    restaurantName: z.string().min(3).max(50),
    city: z.string().min(3).max(50),
  });
}
