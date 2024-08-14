import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

let CREATED = false;
@Injectable({
  providedIn: 'root',
})
export class GuardGuard {
  constructor(private router: Router, private authS: AuthService) {
    if (CREATED) {
      alert('Two instances of the same AuthenticationGuard');
      return;
    }
    CREATED = true;
    this.authS.isLoggedInAsync().subscribe((isLoggedIn) => {
      console.log(isLoggedIn);
    });
  }

  canActivate(state: RouterStateSnapshot) {
    // route
    if (this.authS.isLoggedInSync()) {
      return true;
    }
    this.router.navigate(['/index/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
