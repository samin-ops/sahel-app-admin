import { Route } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

export default [
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: 'register', component: SignupComponent },
] as Route[];
