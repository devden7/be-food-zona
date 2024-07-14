import { Controller } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('/api')
export class ProductsController {
  constructor(productService: ProductsService) {}
}
