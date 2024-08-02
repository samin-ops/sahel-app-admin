import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductListResponseDto } from '../dtos/responses/products/product.dto';
import { Product } from '../models/product';
import { ShoppingCart } from '../models/shopping-cart.model';
import { ShoppingCartServiceService } from './shopping-cart-service.service';

let CREATED = false;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productList: Product[];
  private products: ProductListResponseDto;
  readonly api = 'http://localhost:3000/api/v1/user';

  defaultPagination;
  cartSnapshot!: ShoppingCart;
  constructor(
    private http: HttpClient,
    private shopingCartS: ShoppingCartServiceService
  ) {
    if (CREATED) {
      alert('Two instances of the same ProductsService');
      return;
    }
    CREATED = true;
    this.defaultPagination = {
      page: 1,
      pageSize: 6,
    };
    this.api;
    // subscribe to shopping cart
    this.shopingCartS.getCart().subscribe((cart: any) => {
      this.cartSnapshot = cart;
    });
  }
}
