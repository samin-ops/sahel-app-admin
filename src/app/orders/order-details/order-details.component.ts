import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderItemDto } from 'src/app/shared/dtos/responses/order-items/order-item.dto';
import { OrderDetailsDto } from 'src/app/shared/dtos/responses/order/order-detail.response';
import { OrsersService } from 'src/app/shared/services/orsers.service';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
})
export class OrderDetailsComponent implements OnInit {
  orderItems: OrderItemDto[] = [];
  order: OrderDetailsDto;

  constructor(private orderS: OrsersService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];

      this.orderS.getOrder(id).subscribe((res) => {
        if (res.success) {
          console.log(res);
          const response = res as OrderDetailsDto;
          this.order = response;
          this.orderItems = this.order.order_items;
          console.log(this.order);
          console.log(this.orderItems);
        }
      });
    });
  }
}
