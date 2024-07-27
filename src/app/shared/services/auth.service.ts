import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, retry, tap } from 'rxjs';
import { ErrorResult } from '../dtos/local/base';
import { LoginRequestDto } from '../dtos/requests/login.dto';
import {
  buildError,
  buildErrorObservable,
} from '../dtos/responses/shared/utils/net.utils';
import { LoginDtoResponse } from '../dtos/responses/users/auth.dto';
import { User } from '../models/user';
import { LocalstorageServicesService } from './localstorage-services.service';
import { NotificationService } from './notification.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly api = 'http://localhost:3000/api/v1/user';

  isLoggedIn: boolean | undefined;
  cachedUser: User | undefined;
  user!: BehaviorSubject<User>;
  USER_KEY = 'auth_user';

  constructor(
    private http: HttpClient,
    private notificationS: NotificationService,
    private localstorageS: LocalstorageServicesService
  ) {}

  signUp(userInfo: Object): Observable<any> {
    return this.http.post<any>(`${this.api}/register`, userInfo, httpOptions);
  }

  login(credential: LoginRequestDto): Observable<User | ErrorResult> {
    return this.http
      .post<LoginDtoResponse>(`${this.api}/login`, credential, httpOptions)
      .pipe(
        retry(2),
        map((res) => {
          if (res && res.success) {
            if (
              res.full_messages &&
              Array.isArray(res.full_messages) &&
              res.full_messages.length > 0
            ) {
              this.notificationS.dispatchSuccessMessage(res.full_messages[0]);
            } else {
              this.notificationS.dispatchSuccessMessage(
                'Logged in successfully'
              );
            }
            const user: any = res.user;
            user.token = res.token;
            this.saveUser(user);
            return user;
          }
          return buildError('Unknown error while trying to login');
        }),
        catchError((err: any) => {
          this.notificationS.dispatchErrorMessage(err.message);
          return buildErrorObservable(err);
        })
      );
  }
  logout() {
    this.clearUser();
  }

  isLoggedInSync(): boolean {
    // return this.cachedUser != null && this.cachedUser.username !== null;
    return (
      this.user.getValue() != null && this.user.getValue().username !== null
    );
  }

  isLoggedInAsync(): Observable<boolean> {
    return this.user.pipe(
      map((user) => {
        if (user == null || user.username == null) {
          return false;
        }
        return true;
      })
    );
  }

  isAdminSync(): boolean {
    return this.user.getValue().roles.indexOf('admin') !== -1;
  }

  getUser(): Observable<User> {
    return this.user.asObservable(); // this.user is undefined
  }

  isAdminAsync(): Observable<boolean> {
    return this.user.pipe(
      map((user) => {
        if (user == null) {
          return false;
        }
        const rolesIntersection = user.roles.filter(
          (role) => -1 !== ['admin'].indexOf(role)
        );
        return rolesIntersection.length >= 1;
      })
    );
  }

  saveUser(user: User) {
    this.localstorageS.clear(this.USER_KEY);
    this.cachedUser = user;
    this.localstorageS.set(this.USER_KEY, JSON.stringify(user));
    this.user.next(user);
  }

  private getUserSync(): User | any {
    const user = this.localstorageS.get(this.USER_KEY);
    if (user) {
      return JSON.parse(user) as User;
    }
    return null;
  }

  clearUser() {
    this.signOut();
  }

  signOut() {
    this.localstorageS.clear(this.USER_KEY);
    //this.user.next(); // a revoir
  }

  public getRolesSync(): string[] {
    const roles: any = [];
    if (this.localstorageS.get(this.USER_KEY)) {
      JSON.stringify(sessionStorage.getItem(this.USER_KEY));
    }
    return roles;
  }
}
