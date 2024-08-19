import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from 'src/app/shared/models/product';
import { Comment } from 'src/app/shared/models/comment.model';
import { Subscription } from 'rxjs';
import { ShoppingCart } from 'src/app/shared/models/shopping-cart.model';
import { User } from 'src/app/shared/models/user';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from 'src/app/shared/services/product.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ShoppingCartServiceService } from 'src/app/shared/services/shopping-cart-service.service';
import { CommentSubmittedResponse } from 'src/app/shared/dtos/responses/comments/comment-submitted.dto';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product: Product;
  isLoggedIn: boolean = false;
  private subscriptions: Subscription[] = [];
  commentForm: FormGroup;
  quantity = 0;
  private cart: ShoppingCart;
  currentUser: User;

  constructor(
    private route: ActivatedRoute,
    private productS: ProductService, //
    private userservice: AuthService,
    private notificationS: NotificationService,
    private shoppingS: ShoppingCartServiceService,
    private fb: FormBuilder
  ) {
    this.product = new Product();
    this.subscriptions.push(
      this.userservice.getUser().subscribe((user) => {
        this.currentUser = user;
        this.isLoggedIn = !user;
      })
    );

    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        const slug = params['slug']; // (+) converts string 'id' to a number
        this.getProductDetail(slug);
      })
    );
    this.subscriptions.push(
      this.shoppingS.getCart().subscribe((cart) => {
        this.cart = cart;
        this.updateQuantityValue();
        // we could actually make the check here with :
        // const cartItem = this.cart.cartItems.find(ci => ci.slug === this.route.snapshot.params.slug);
        // which does not require the product to be fetched from the remote server to know if it is in cart and
        // the quantity.
      })
    );
  }

  updateQuantityValue() {
    const cartItem = this.cart.cartItems.find(
      (item) => item.id === this.product?.id
    );
    if (cartItem) {
      this.quantity = cartItem.quantity;
    } else {
      this.quantity = 1;
    }
  }
  getProductDetail(slug: string) {
    this.productS.getBySlug(slug).subscribe((res) => {
      // this.spinnerService.hide();

      if (res) {
        this.product = new Product(res);
        this.updateQuantityValue();
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  addOrUpdateCart(count: string | number) {
    if (this.product == null) {
      return;
    }
    // to avoid the type checking error, set as string, it would work anyways though
    const quantity = parseInt(count as string, 10);
    if (quantity <= 0 && this.product.isInCart) {
      this.shoppingS.removeFromCart(this.product);
      this.product.isInCart = false;
      return;
    } else if (this.product.isInCart) {
      this.shoppingS.updateQuantity(this.product, quantity);
    } else {
      this.shoppingS.addToCart(this.product, quantity);
    }

    this.product.isInCart = true;
  }

  submitComment() {
    if (this.commentForm.valid) {
      this.notificationS.dispatchSuccessMessage('Submitting Login Form');
      const { content } = this.commentForm.value;
      const comment: any = new Comment({
        productId: this.product.id,
        content: content,
        id: null,
      });
      console.log(this.product.slug);
      this.productS
        .submitComment(comment, this.product?.slug)
        .subscribe((res) => {
          if (res.success) {
            // Clear the text area
            this.commentForm.patchValue({ content: '' });

            if (this.product?.comments == null) {
              this.product.comments = [];
            }
            const response = res as CommentSubmittedResponse;
            console.log(response);
            this.product.comments.push(
              new Comment({
                id: response.id,
                username: response.username,
                content: response.content,
                createdAt: response.created_at,
              })
            );
          }
        });
    }
  }

  oNdeleteComment(comment: Comment) {
    this.productS.deleteComment(comment.id).subscribe((res) => {
      if (res.success) {
        this.product.comments = this.product.comments.filter(
          (cachedComments: any) => cachedComments.id !== comment.id
        );
      }
    });
  }
}
