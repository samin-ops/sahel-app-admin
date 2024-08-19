import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, retry, tap } from 'rxjs';
import { ErrorResult, SuccessResult } from '../dtos/local/base';
import { PaginationRequestDto } from '../dtos/requests/base.dto';
import {
  ProductDto,
  ProductListResponseDto,
} from '../dtos/responses/products/product.dto';
import {
  BaseAppDtoResponse,
  ErrorAppDtoResponse,
} from '../dtos/responses/shared/base.dto';
import { Product } from '../models/product';
import { ShoppingCart } from '../models/shopping-cart.model';
import { NotificationService } from './notification.service';
import { ShoppingCartServiceService } from './shopping-cart-service.service';
import { buildErrorObservable } from '../utils/net.utils';

let CREATED = false;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productList: Product[];
  products: ProductListResponseDto;
  readonly api = 'http://localhost:3000/api/v1/user';

  cartSnapshot: ShoppingCart;
  productsBehaviourSubject: BehaviorSubject<ProductListResponseDto>;

  private lastUpdatedApiResponseForAll: number = 0;
  private lastUpdatedApiResponseForEach: Object[] = [];

  public defaultPagination: PaginationRequestDto = { page: 0, pageSize: 0 };
  private lastPaginatedRequest: PaginationRequestDto = { page: 0, pageSize: 0 };

  constructor(
    private http: HttpClient,
    private shopingCartS: ShoppingCartServiceService,
    private notificationService: NotificationService
  ) {
    if (CREATED) {
      alert('Two instances of the same ProductsService');
      return;
    }
    CREATED = true;
    this.defaultPagination = {
      page: 1,
      pageSize: 6,
    };
    this.api;
    // subscribe to shopping cart
    this.shopingCartS.getCart().subscribe((cart: any) => {
      this.cartSnapshot = cart;
    });
  }

  getAllProducts(
    query: PaginationRequestDto = this.defaultPagination
  ): Observable<ProductListResponseDto | ErrorResult> {
    // If products-api null or length is 0 or last time fetched more than 20 seconds then
    if (
      this.products == null ||
      this.lastPaginatedRequest.page !== query.page ||
      this.lastPaginatedRequest.pageSize !== query.pageSize ||
      this.products.products.length === 0 ||
      new Date().getTime() - this.lastUpdatedApiResponseForAll > 20 * 1000
    ) {
      this.http
        .get<ProductListResponseDto | ErrorAppDtoResponse>(
          `${this.api}?page=${query.page}&page_size=${query.pageSize}`
        )
        .pipe(
          retry(2),
          tap((resp: any) => {
            console.log('canceled:false');
            const isCanceled = false;
          })
        )
        .subscribe({
          next: (res) => {
            this.lastPaginatedRequest = query;
            console.log('success:' + res.success);
            if (res.success && res.products) {
              this.productList = res.products;
              this.products = res;
              this.lastUpdatedApiResponseForAll = new Date().getTime();
              this.notifyDataChanged();
            }
            return res as ProductListResponseDto;
          },
          error: (err) => {
            this.notificationService.dispatchErrorMessage(err);
            return buildErrorObservable(err);
          },
        });
    } else {
      console.log(
        '[+] Products not fetched because the condition has not been met(you recently fetched the same page and pageSize)'
      );
    }

    // always return the behaviourSubject, this guy will notify the observers for any update
    return this.productsBehaviourSubject.asObservable();
  }

  private notifyDataChanged() {
    this.productsBehaviourSubject.next(this.products);
  }

  getById(id: number): Observable<ProductDto> {
    return this.http.get<ProductDto>(`${this.api}/by_id/${id}`);
  }

  getBySlug(slug: string): Observable<Product | ErrorResult> {
    return this.http.get<Product>(`${this.api}/${slug}`).pipe(
      map((res) => {
        // TODO: Fix this
        if (this.cartSnapshot == null) {
          this.cartSnapshot = this.shopingCartS.getCartSnapshot();
          debugger;
        }
        this.notificationService.dispatchSuccessMessage(
          'Retrieved product details'
        );
        const product = res as Product;
        const responseSlug = res.slug;
        const id = res.id;
        const cartItem = this.cartSnapshot.cartItems.find(
          (ci) => ci.id === id && ci.slug === responseSlug
        );
        product.isInCart = !!cartItem;
        return product;
      }),
      catchError((err) => {
        this.notificationService.dispatchErrorMessage(err.message);
        return buildErrorObservable(err);
      })
    );
  }

  createProduct(
    product: Product,
    images: FileList
  ): Observable<ProductDto | ErrorResult> {
    const formData = new FormData();

    for (let i = 0; i < images.length; i++) {
      formData.append('images[]', images[i], images[i]['name']);
    }

    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('stock', product.stock.toString());
    formData.append('price', product.price.toString());

    return this.http.post<ProductDto | ErrorResult>(this.api, formData).pipe(
      map((res) => {
        res.success;
        this.notificationService.dispatchSuccessMessage(
          res.full_messages?.join('<br/>')
        );
        res.full_messages;
        return res as ProductDto;
      }),
      catchError((err) => {
        this.notificationService.dispatchErrorMessage(err.message);
        return buildErrorObservable(err);
      })
    );
  }

  update(product: Product): Observable<ProductDto | any> {
    return this.http
      .put<ProductDto>(this.api, product /*, this.httpOptions */)
      .pipe(
        retry(5),
        map((res) => {
          if (res.success) {
            //const at = this.products.products.find((t) => t.id == res.id);
            // Update the products-api array
            this.products.products = this.products.products.map((t) =>
              t.id === product.id ? product : t
            );
          }
          return res; // || {};
        }),
        catchError((err) => {
          return err;
        })
      );
  }

  deleteAll(): Observable<any> {
    return this.http.delete(this.api).pipe(
      map((res) => {
        return res;
        // this.products-api = [];
        // return this.productsBehaviourSubject;
      }),
      catchError((err) => {
        return err;
      })
    );
  }

  deleteById(id: number) {
    return this.http.delete<Product>(`${this.api}/${id}` /*this.httpOptions*/);
  }

  public unusedGetAll(): Observable<Product[]> {
    // TODO: Return an observable but before assigns this.cart
    return this.http.get<Product[]>(this.api);
  }

  submitComment(
    comment: Comment,
    slug: string
  ): Observable<BaseAppDtoResponse> {
    return this.http
      .post<BaseAppDtoResponse>(`${this.api}/${slug}/comments`, comment)
      .pipe(
        map((res) => {
          this.notificationService.dispatchSuccessMessage('Comment submitted');
          return res;
        }),
        catchError((err) => {
          console.log(err);
          this.notificationService.dispatchErrorMessage(err);
          return [];
        })
      );
  }

  deleteComment(id: number): Observable<SuccessResult | ErrorResult> {
    if (id == null) {
      this.notificationService.dispatchErrorMessage(
        'Invalid comment id provided to delete'
      );
      return buildErrorObservable('Invalid comment id provided to delete');
    }
    return this.http
      .delete<BaseAppDtoResponse>(`${this.api}comment/${id}`)
      .pipe(
        map(
          (res) => {
            this.notificationService.dispatchSuccessMessage('Comment deleted');
            return res;
          },
          catchError((err) => {
            this.notificationService.dispatchErrorMessage(err);
            return buildErrorObservable(err);
          })
        )
      );
  }
}
