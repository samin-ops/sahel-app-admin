import { catchError, map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { ErrorResult } from '../dtos/local/base';
import { buildErrorObservable } from '../utils/net.utils';
import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { AddressListResponseDto } from '../dtos/responses/address/addresses.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddressesService {
  readonly baseUrl: string;

  constructor(
    private httpClient: HttpClient,
    private notificationS: NotificationService
  ) {
    this.baseUrl;
  }

  fetchAll(): Observable<AddressListResponseDto | ErrorResult> {
    return this.httpClient.get<AddressListResponseDto | any>(this.baseUrl).pipe(
      map((res) => {
        if (res.success && res.addresses) {
          console.log('[+] Received ' + res.addresses.length + ' addresses');
        }
        return res as AddressListResponseDto;
      }),
      catchError((err) => {
        return buildErrorObservable(err);
      })
    );
  }
}
