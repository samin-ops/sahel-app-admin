import { Route } from '@angular/router';
import { AddressCreateComponent } from './address-create/address-create.component';
import { AddressDetailsComponent } from './address-details/address-details.component';
import { AddressListComponent } from './address-list/address-list.component';

export default [
  { path: '', component: AddressCreateComponent },
  {
    path: '',
    redirectTo: '/address/list',
    pathMatch: 'full',
  },
  { path: 'list', component: AddressListComponent },
  { path: 'detail', component: AddressDetailsComponent },
] as Route[];
