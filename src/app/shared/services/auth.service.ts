import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, retry } from 'rxjs';
import { ErrorResult } from '../dtos/local/base';
import { LoginRequestDto } from '../dtos/requests/login.dto';
import { buildError, buildErrorObservable } from '../utils/net.utils';
import { LoginDtoResponse } from '../dtos/responses/users/auth.dto';
import { User } from '../models/user';
import { LocalstorageServicesService } from './localstorage-services.service';
import { NotificationService } from './notification.service';
import { RegisterDto } from '../dtos/requests/register.dto';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
  }),
};

let CREATED = false;
const USER_KEY = 'auth_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly api = 'http://localhost:3000/api/v1/user';

  isLoggedIn: boolean;
  private cachedUser: User;
  private user: BehaviorSubject<User>;

  constructor(
    private http: HttpClient,
    private notificationS: NotificationService,
    private localstorageS: LocalstorageServicesService
  ) {
    if (CREATED) {
      alert('Two instances of the same UsersService');
      return;
    }
    CREATED = true;
    this.cachedUser = this.getUserSync();
    this.isLoggedIn = !!this.cachedUser;
    this.user = new BehaviorSubject(this.cachedUser);
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

  register(userInfo: RegisterDto): Observable<any>{
    return this.http.post(`${this.api}/register`, userInfo, httpOptions)
      
  }

  
  logout() {
    this.clearUser();
  }

  isLoggedInSync(): boolean {
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
    return this.user.getValue().roles.indexOf('ROLES_ADMIN') !== -1;
  }

  getUser(): Observable<User> {
    return this.user.asObservable();
  }

  isAdminAsync(): Observable<boolean> {
    return this.user.pipe(
      map((user) => {
        if (user == null) {
          return false;
        }
        const rolesIntersection = user.roles.includes('ROLES_ADMIN');
        // const rolesIntersection = user.roles.name.filter(
        //   (role) => -1 !== ['ADMIN'.toLowerCase()].indexOf(role)
        // );
        return rolesIntersection;
      })
    );
  }

  // isAdminAsync(): Observable<boolean> {
  //   return this.user.pipe(
  //     map((user) => {
  //       if (user == null) {
  //         return false;
  //       }
  //       const rolesIntersection = user.roles.name.includes('admin');
  //       return rolesIntersection;
  //       //const rolesIntersection = user.roles.name.((role) => -1 !== ['admin'].indexOf(role));
  //       //return rolesIntersection.length >= 1;
  //     })
  //   );
  // }

  saveUser(user: User) {
    this.localstorageS.clear(USER_KEY);
    this.cachedUser = user;
    this.localstorageS.set(USER_KEY, JSON.stringify(user));
    this.user.next(user);
  }

  private getUserSync(): User | any {
    const user = this.localstorageS.get(USER_KEY);
    if (user) {
      return JSON.parse(user) as User;
    }
    return null;
  }

  clearUser() {
    this.signOut();
  }

  signOut() {
    this.localstorageS.clear(USER_KEY);
    this.user.unsubscribe(); // this.user.next(null);
  }

  getRolesSync(): string[] {
    const roles: any[] = [];
    if (this.localstorageS.get(USER_KEY)) {
      const item = localStorage.getItem(USER_KEY);
      return item
        ? JSON.parse(item).roles.forEach((role: any) => {
            roles.push(role);
          })
        : [];
    }
    return roles;
  }
}
