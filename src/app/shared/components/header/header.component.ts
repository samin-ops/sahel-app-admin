import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ShoppingCartServiceService } from '../../services/shopping-cart-service.service';
import { ShoppingCart } from '../../models/shopping-cart.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  cart: Observable<ShoppingCart>;
  message: string;
  cartItemsLength: number;
  isLoggedIn = false;
  private subscriptions: Subscription[] = [];
  className: string;

  constructor(
    private usersService: AuthService,
    public cartService: ShoppingCartServiceService,
    private notificationService: NotificationService,
    private router : Router
  ) {
    this.cart = this.cartService.getCart();
    this.subscriptions.push(
      this.usersService.isLoggedInAsync().subscribe((isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
        // this.isLoggedIn = !!(user && user.username && user.token);
      })
    );
    this.cart.subscribe((cart) => {
      this.cartItemsLength = cart.cartItems.length;
    });
    this.notificationService.getNotifications().subscribe((notification) => {
      if (notification == null) {
        return;
      }
      this.className =
        notification === 'success'
          ? 'alert alert-success'
          : 'alert alert-danger';
      this.message = 'message';
    });
  }

  ngOnInit() {}

  logout() {
    this.usersService.logout();
  }

  ngOnDestroy() {
    // TODO: Unsubscribe
  }
}
