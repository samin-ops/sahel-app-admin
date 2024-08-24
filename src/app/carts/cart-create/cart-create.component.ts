import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ShoppingCart } from 'src/app/shared/models/shopping-cart.model';
import { Product } from 'src/app/shared/models/product';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductService } from 'src/app/shared/services/product.service';
import { ShoppingCartServiceService } from 'src/app/shared/services/shopping-cart-service.service';
import { CartSummaryComponent } from '../cart-summary/cart-summary.component';
import { CartDetailsComponent } from '../cart-details/cart-details.component';

@Component({
  selector: 'app-cart-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CartSummaryComponent,
    CartDetailsComponent,
  ],
  templateUrl: './cart-create.component.html',
  styleUrls: ['./cart-create.component.css'],
})
export class CartCreateComponent implements OnInit {
  cart: Observable<ShoppingCart>;
  cartItems: Product[];
  showDataNotFound = true;

  // Not Found Message
  messageTitle = 'No Products Found in Cart';
  messageDescription = 'Please, Add Products to Cart';
  myCartProductsFrom: FormGroup;
  totalAmount: number;

  constructor(
    private productS: ProductService,
    private shoppingS: ShoppingCartServiceService
  ) {
    this.cart = this.shoppingS.getCart();
    this.cart.subscribe((cart) => {
      this.cartItems = cart.cartItems;
      this.totalAmount = cart.cartItems.reduce(
        (accumulator, cartItem) =>
          accumulator + cartItem.quantity * cartItem.price,
        0
      );
    });

    this.createForm();
  }

  ngOnInit() {}

  removeCartProduct(product: Product) {
    this.shoppingS.removeFromCart(product);
  }
  updateQuantities($event: any) {
    $event.preventDefault();
    console.log(this.myCartProductsFrom.value);

    // ES6 syntax same as for(var key in form){form[key]}
    for (const [id, quantity] of Object.entries(
      this.myCartProductsFrom.value
    )) {
      const cartItem: any = this.cartItems.find((ci) => ci.id === +id);
      this.shoppingS.updateQuantity(cartItem, Number(quantity));
    }
  }

  private createForm() {
    const group: { [key: string]: AbstractControl } = {};
    this.cartItems.forEach((product) => {
      group[product.id] = new FormControl(product.quantity, [
        Validators.required,
        Validators.min(0),
      ]);
    });
    this.myCartProductsFrom = new FormGroup(group);
  }
}
