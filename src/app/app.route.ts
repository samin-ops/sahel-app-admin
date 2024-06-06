import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

export const APP_ROUTE: Route[] = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.route'),
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    loadChildren: () => import('./dashboard/dashboard.route'),
  },
];
