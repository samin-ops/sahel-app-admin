export interface IAuthService {
  register(key: string): any;
  login(key: string, value: string): any;
  logout(key: string): any;
}
