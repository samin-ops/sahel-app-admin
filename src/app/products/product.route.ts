import { Route } from '@angular/router';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductListComponent } from './product-list/product-list.component';

export default [
  { path: '', component: ProductCreateComponent },
  { path: 'list', component: ProductListComponent },
  { path: 'detail', component: ProductDetailsComponent },
] as Route[];
