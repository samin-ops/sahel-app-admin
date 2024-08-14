interface IStorageService {
  get(key: string): any;
  set(key: string, value: string): any;
  clear(key: string): any;
}
