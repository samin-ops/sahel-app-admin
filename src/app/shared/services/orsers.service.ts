import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { ErrorResult } from '../dtos/local/base';
import { OrderDetailsDto } from '../dtos/responses/order/order-detail.response';
import { OrderListDto } from '../dtos/responses/order/order-list.dto';
import { ContactInfo } from '../models/contact-infos.model';
import { Product } from '../models/product';
import { buildErrorObservable } from '../utils/net.utils';
import { NotificationService } from './notification.service';
import { ShoppingCartServiceService } from './shopping-cart-service.service';

let CREATED = false;
@Injectable({
  providedIn: 'root',
})
export class OrsersService {
  readonly api = 'http://localhost:3000/api/v1/order';
  constructor(
    private httpClient: HttpClient,
    private cartService: ShoppingCartServiceService,
    private notificationService: NotificationService
  ) {
    if (CREATED) {
      alert('Two instances of the same OrdersService');
      return;
    }
    CREATED = true;
  }
  createOrderwithNewAddress(
    products: Product[],
    contactInfo: ContactInfo
  ): Observable<OrderDetailsDto | ErrorResult> {
    const contactData = {
      // TODO: we are placing redundant fields, fix.
      ...contactInfo,
      first_name: contactInfo.firstName,
      last_name: contactInfo.lastName,
      zip_code: contactInfo.zipCode,
      card_number: contactInfo.cardNumber,
    };

    return this.handleCreateOrderPromise(
      this.httpClient.post<OrderDetailsDto | ErrorResult>(`${this.api}`, {
        cart_items: products,
        ...contactData,
      })
    );
  }

  createOrderReusingAddress(
    cartItems: Product[],
    addressId: string
  ): Observable<OrderDetailsDto | ErrorResult> {
    return this.handleCreateOrderPromise(
      this.httpClient.post<OrderDetailsDto>(`${this.api}`, {
        cart_items: cartItems,
        address_id: addressId,
      })
    );
  }

  getMyOrders(): Observable<OrderListDto> {
    return this.httpClient.get<OrderListDto>(this.api).pipe(
      map(
        (res) => {
          if (res.success) {
            const response = res as OrderListDto;
            console.log(res);
            this.notificationService.dispatchSuccessMessage(
              'Retrieved ' + response.page_meta.current_items_count
            );
          }
          return res;
        },
        catchError((err) => {
          this.notificationService.dispatchErrorMessage(err);
          return [];
        })
      )
    );
  }

  getOrder(id: number): Observable<OrderDetailsDto> {
    return this.httpClient.get<OrderDetailsDto>(`${this.api}/${id}`).pipe(
      map((res) => {
        if (res.success) {
          const response = res as OrderDetailsDto;
        }
        return res;
      }),
      catchError((err) => {
        this.notificationService.dispatchErrorMessage(err);
        return [];
      })
    );
  }

  private handleCreateOrderPromise(
    orderPromise: Observable<OrderDetailsDto | ErrorResult>
  ): Observable<OrderDetailsDto | ErrorResult> {
    return orderPromise.pipe(
      map((res) => {
        if (res.success) {
          this.notificationService.dispatchSuccessMessage(
            'Order placed successfully'
          );
          this.cartService.clearCart();
        }
        return res;
      }),
      catchError((err) => {
        this.notificationService.dispatchErrorMessage(err.message);
        return buildErrorObservable(err);
      })
    );
  }
}
