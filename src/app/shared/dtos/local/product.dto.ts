import { ProductDto } from '../responses/products/product.dto';

export class ProductLocalDto extends ProductDto {
  isInCart: boolean;
}
