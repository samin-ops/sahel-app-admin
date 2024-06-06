import { Route } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductComponent } from './product/product.component';
import { SidebarComponent } from './sidebar/sidebar.component';

export default [
  { path: 'sidebar', component: SidebarComponent },
  { path: 'product', component: ProductComponent },
  { path: 'productList', component: ProductListComponent },
  { path: 'category', component: CategoryComponent },
] as Route[];
