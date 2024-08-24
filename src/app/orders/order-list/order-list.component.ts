import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from 'src/app/shared/models/order.model';
import { OrsersService } from 'src/app/shared/services/orsers.service';
import { OrderListDto } from 'src/app/shared/dtos/responses/order/order-list.dto';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];

  constructor(private ordersService: OrsersService) {}

  ngOnInit() {
    this.ordersService.getMyOrders().subscribe((res) => {
      if (res.success) {
        console.log(res.orders);
        const response = res as OrderListDto;
        this.orders = response.orders;
      }
    });
  }
}
