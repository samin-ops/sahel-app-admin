import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartServiceService } from 'src/app/shared/services/shopping-cart-service.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css'],
})
export class CartDetailsComponent implements OnInit {
  constructor(private shoppingCartService: ShoppingCartServiceService) {}

  ngOnInit() {}

  clearCart() {
    this.shoppingCartService.clearCart();
  }
}
