import { Route } from '@angular/router';
import { OrderCreateComponent } from './order-create/order-create.component';
import { OrderListComponent } from './order-list/order-list.component';

export default [
  { path: '', component: OrderCreateComponent },
  { path: 'list', component: OrderListComponent },
  { path: 'details', component: OrderListComponent },
] as Route[];
