import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/shared/models/user';
import { Product } from 'src/app/shared/models/product';
import { Subscription } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AddressDto,
  AddressListResponseDto,
} from 'src/app/shared/dtos/responses/address/addresses.dto';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrsersService } from 'src/app/shared/services/orsers.service';
import { ShoppingCartServiceService } from 'src/app/shared/services/shopping-cart-service.service';
import { AddressesService } from 'src/app/shared/services/addresses.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router, RouterModule } from '@angular/router';
import { ContactInfo } from 'src/app/shared/models/contact-infos.model';
import { CartSummaryComponent } from '../../carts/cart-summary/cart-summary.component';

@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CartSummaryComponent,
  ],
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.css'],
})
export class OrderCreateComponent implements OnInit, OnDestroy {
  user: User;
  isLoggedIn: boolean;
  cartItems: Product[] = [];
  subscriptions: Subscription[] = [];
  checkoutForm: FormGroup;
  addresses: AddressDto[];
  selectedAddress: AddressDto;

  constructor(
    private authS: AuthService,
    private orderS: OrsersService,
    private shoppingS: ShoppingCartServiceService,
    private addresS: AddressesService,
    private notificationS: NotificationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.user = new User({});
    this.authS.getUser().subscribe((user) => {
      this.user = user;
      if (user !== null) {
        this.isLoggedIn = true;
        this.addresS.fetchAll().subscribe({
          next: (res) => {
            if (res.success) {
              this.addresses = (res as AddressListResponseDto).addresses;
            }
          },
          error: (err) => {
            debugger;
            console.log(err);
          },
        });
      } else {
        this.isLoggedIn = false;
      }
    });

    this.subscriptions.push(
      this.shoppingS.getCart().subscribe((cart) => {
        if (cart !== null) {
          this.cartItems = cart.cartItems;
          console.log(this.cartItems);
        }
      })
    );

    this.createForm();
  }

  ngOnInit() {}

  updateUserDetails(form: NgForm) {
    const data = form.value;

    data['email'] = this.user.email;
    data['username'] = this.user.username;

    console.log('Data: ', data);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  createForm() {
    this.checkoutForm = this.fb.group({
      firstName: [
        this.user.firstName,
        [Validators.required, Validators.minLength(2)],
      ],
      lastName: [
        this.user.lastName,
        [Validators.required, Validators.minLength(2)],
      ],
      username: [
        this.user.username,
        [Validators.required, Validators.minLength(2)],
      ],
      email: [this.user.email, [Validators.required, Validators.email]],
      streetAddress: [
        this.user.address,
        [Validators.required, Validators.minLength(2)],
      ],
      city: [this.user.city, [Validators.required, Validators.minLength(2)]],
      country: [
        this.user.country,
        [Validators.required, Validators.minLength(2)],
      ],
      zipCode: [
        this.user.zipCode,
        [Validators.required, Validators.minLength(2)],
      ],
      cardNumber: ['', []],
    });
  }

  public submitCheckout(): void {
    if (this.checkoutForm.valid) {
      let checkoutObservable;
      if (this.selectedAddressUnchanged()) {
        checkoutObservable = this.orderS.createOrderwithNewAddress(
          this.cartItems,
          new ContactInfo(this.checkoutForm.value)
        );
      } else {
        checkoutObservable = this.orderS.createOrderReusingAddress(
          this.cartItems,
          this.selectedAddress.id
        );
      }
      checkoutObservable.subscribe({
        next: (res) => {
          if (res.success) {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          debugger;
          console.log(err);
        },
      });
    }
  }

  selectedAddressUnchanged() {
    return (
      this.selectedAddress &&
      this.selectedAddress.first_name === this.checkoutForm.value.firstName &&
      this.selectedAddress.last_name === this.checkoutForm.value.lastName &&
      this.selectedAddress.street_address ===
        this.checkoutForm.value.streetAddress &&
      this.selectedAddress.city === this.checkoutForm.value.city &&
      this.selectedAddress.country === this.checkoutForm.value.country &&
      this.selectedAddress.zip_code === this.checkoutForm.value.zipCode
    );
  }

  onAddressChanged($event: any) {
    const address: any = this.addresses.find(
      (a) => String(a.id) === $event.target.value
    );
    this.selectedAddress = address;
    this.checkoutForm.patchValue({
      firstName: address.first_name,
      lastName: address.last_name,
      username: this.isLoggedIn ? this.user.username : '',
      email: this.isLoggedIn ? this.user.email : '',
      streetAddress: address.street_address,
      city: address.city,
      country: address.country,
      zipCode: address.zip_code,
    });
  }
}
