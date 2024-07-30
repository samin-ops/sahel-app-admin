import { Injectable } from '@angular/core';
import {  Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  constructor(private authS: AuthService, private router: Router){}
  canActivate() {
    if (this.authS.isLoggedInSync() && this.authS.isAdminSync()) {
      return true;
    }
    this.router.navigate(['home']);
    return false;
  }
  
}
