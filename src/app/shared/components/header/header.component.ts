import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  constructor() {}

  logout() {}
}
