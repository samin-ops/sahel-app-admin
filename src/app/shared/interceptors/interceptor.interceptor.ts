import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {
  private token: string;

  constructor(private usersService: AuthService) {
    this.usersService.getUser().subscribe((user) => {
      if (user && user.token) {
        this.token = user.token;
      } else {
        this.token = '';
      }
    });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headersConfig: any = {
      // 'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (this.token) {
      headersConfig['Authorization'] = `Bearer ${this.token}`;
    }

    const request = req.clone({ setHeaders: headersConfig });
    return next.handle(request);
  }
}
