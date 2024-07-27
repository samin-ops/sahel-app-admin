import { Route } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

export const APP_ROUTE: Route[] = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.route'),
  },
  {
    path: 'cart',
    loadChildren: () => import('./carts/cart.route'),
  },
  {
    path: 'product',
    loadChildren: () => import('./products/product.route'),
  },
  {
    path: 'order',
    loadChildren: () => import('./orders/order.route'),
  },
  {
    path: 'address',
    loadChildren: () => import('./addresses/addres.route'),
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
