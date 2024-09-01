import { Route } from '@angular/router';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductListComponent } from './product-list/product-list.component';
import { AdminGuard } from '../shared/guards/admin.guard';

export default [
  { path: 'create', component: ProductCreateComponent, canActivate:[AdminGuard] },
  { path: 'list', component: ProductListComponent },
  { path: 'detail', component: ProductDetailsComponent },
] as Route[];
