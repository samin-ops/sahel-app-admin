import { Category } from 'src/app/shared/models/category.model';
import { Product } from 'src/app/shared/models/product';
import { Tag } from 'src/app/shared/models/tag.model';
import { BaseAppDtoResponse } from '../shared/base.dto';
import { PagedResponseDto } from '../shared/page.meta.dto';

export class ProductDto extends BaseAppDtoResponse {
  // product: Product;
  // authInfo: AuthInfo;

  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  image_urls: string[];
  created_at: string;
  categories?: Category[];
  tags?: Tag[];
  comments?: Comment[];
}

export class ProductListResponseDto extends PagedResponseDto {
  products: Product[];
}
