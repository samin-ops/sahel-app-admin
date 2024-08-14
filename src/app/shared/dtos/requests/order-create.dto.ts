import { ContactInfo } from '../../models/contact-infos.model';
import { Product } from '../../models/product';

export class CreateOrderDto {
  products: Product[];
  contactInfo: ContactInfo;
}
