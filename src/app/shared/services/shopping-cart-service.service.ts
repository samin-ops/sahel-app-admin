import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Product } from '../models/product';
import { ShoppingCart } from '../models/shopping-cart.model';
import { LocalstorageServicesService } from './localstorage-services.service';

let CREATED = false;

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartServiceService {
  readonly api = 'http://localhost:3000/api/v1/order';

  //cartBehaviorSubject!: BehaviorSubject<ShoppingCart>;

  private subscribers: any;
  readonly cartKey = 'app_cart';
  cartModel: ShoppingCart;
  private cartBehaviorSubject!: BehaviorSubject<ShoppingCart>;

  constructor(
    private http: HttpClient,
    private storageService: LocalstorageServicesService
  ) {
    if (CREATED) {
      alert('Two instances of the same ShoppingCartService');
      return;
    }
    CREATED = true;
    this.cartBehaviorSubject = new BehaviorSubject(this.cartModel);
    this.getCartFromStorage();
  }

  getCartFromStorage(): ShoppingCart {
    this.cartModel = JSON.parse(
      localStorage.getItem(this.cartKey)!
    ) as ShoppingCart;
    if (!this.cartModel) {
      this.cartModel = new ShoppingCart();
    } else {
      this.cartModel.cartItems.forEach((ci) => {
        ci.id;
        ci.isInCart = true;
      });
    }
    this.notifyDataSetChanged();
    return this.cartModel;
  }

  getCart(): Observable<ShoppingCart> {
    return this.cartBehaviorSubject.asObservable();
  }

  addToCart(product: Product, quantity: number): Product {
    if (this.cartModel == null) {
      this.cartModel = this.getCartFromStorage();
    }
    let item = this.cartModel.cartItems.find((pr) => pr.id === product.id);
    if (item === undefined) {
      item = new Product();
      item.id = product.id;
      item.name = product.name;
      item.slug = product.slug;
      item.price = product.price;
      item.quantity = 0;
      item.isInCart = true;
    }
    this.cartModel.cartItems.push(item);
    item.quantity += quantity;
    this.commitCartTransaction();
    return item;
  }

  private commitCartTransaction() {
    this.saveCartToStorage();
    this.notifyDataSetChanged();
  }

  private saveCartToStorage(cart: ShoppingCart = this.cartModel) {
    this.storageService.set(this.cartKey, JSON.stringify(cart));
  }

  private notifyDataSetChanged() {
    this.cartBehaviorSubject.next(this.cartModel);
  }

  updateCartLocal(cartState: Object = {}) {}

  checkout(): Observable<any> {
    const body = this.getCartFromStorage();
    return this.http.post(`${this.api}`, body);
  }

  removeFromCart(product: Product) {
    if (this.cartModel === undefined) {
      this.cartModel = this.getCartFromStorage();
    }
    this.cartModel.cartItems = this.cartModel.cartItems.filter(
      (cartItem) => cartItem.id !== product.id
    );
    this.commitCartTransaction();
  }

  getFavoritedProductsCount() {
    return 2;
  }

  updateQuantity(cartItem: Product, quantity: number) {
    if (cartItem == null || !cartItem.isInCart) {
      console.error('product not in cart');
      return null;
    }
    if (quantity <= 0) {
      this.removeFromCart(cartItem);
      return cartItem;
    }
    if (cartItem.quantity !== quantity) {
      cartItem.quantity = 0;
      const item = this.cartModel.cartItems.find((pr) => pr.id === cartItem.id);
      if (item == null) {
        return; //debugger
      }
      item.quantity = quantity;
      cartItem.quantity = quantity;
      this.commitCartTransaction();
      return item;
    }

    return null;
  }

  getCartSnapshot() {
    return this.cartModel;
  }

  clearCart() {
    this.cartModel = new ShoppingCart();
    this.saveCartToStorage(this.cartModel);
    this.notifyDataSetChanged();
  }

  private formatErrors(err: any) {
    return throwError(() => new Error(err.error));
  }
}
