import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListResponseDto } from 'src/app/shared/dtos/responses/products/product.dto';
import { Observable } from 'rxjs';
import { Product } from 'src/app/shared/models/product';
import { Category } from 'src/app/shared/models/category.model';
import { ProductService } from 'src/app/shared/services/product.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { PaginationRequestDto } from 'src/app/shared/dtos/requests/base.dto';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, PaginationComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Observable<ProductListResponseDto | any> ;
  productList!: Product[];
  categories!: Category[];
  selectedCategory!: string;
  isAdmin: boolean = false;
  private errors: any;

  constructor(
    private productS: ProductService,
    private userService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getProductList();
  }

  getProductList() {
    this.products = this.productS.getAllProducts();
    this.products.subscribe((res: any) => {
      if (res && res.success) {
        if (res.products) {
          
          this.productList = res.products;
        }
        if (res.categories) {
          this.categories = res.categories;
        }
      } else {
        console.log(res.errors);
      }
    });
  }

  addOrUpdateCart(product: Product) {}

  edit(id: number) {
    this.productS.getById(id).subscribe((product) => {
      console.log(product);
    });
  }

  getDetails(product: Product) {
    this.productS.getById(product.id).subscribe((res) => {
      if (res.success) {
        this.router.navigate(['simple_todos_api/', res.id]);
      }
      console.log('fetched ' + res.id);
    });
  }

  onLoadMore(query: PaginationRequestDto) {
    this.productS.getAllProducts(query); // no need to subscribe, we render using observables so angular takes care for us
  }
  userIsAdmin() {
    this.userService.isAdminAsync().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });
  }

  removeProduct() {}
}
