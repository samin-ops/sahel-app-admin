import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  private cart: Observable<ShoppingCart>;
    private message: string;
    private cartItemsLength: number;
    private isLoggedIn = false;
    private subscriptions: Subscription[] = [];
    private className: string;

  constructor(private usersService: AuthService, private cartService: ShoppingCartServiceService,
    private notificationService: NotificationService) {}

    ngOnInit(){
      this.cart = this.cartService.getCart();

    }

    ngOnDestroy() {

    }

  logout() {}
}
