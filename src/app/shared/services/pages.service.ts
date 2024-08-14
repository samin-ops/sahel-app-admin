import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { ErrorResult } from '../dtos/local/base';
import { HomeResponseDto } from '../dtos/responses/pages/home.dto';
import { buildErrorObservable } from '../utils/net.utils';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class PagesService {
  readonly api = 'http://localhost:3000/api/v1/page';

  constructor(
    private httpClient: HttpClient,
    private notificationService: NotificationService
  ) {
    this.api;
  }

  fetchHome(): Observable<HomeResponseDto | ErrorResult> {
    return this.httpClient.get<HomeResponseDto>(this.api).pipe(
      map((res) => {
        if (res.success) {
          console.log('[+] Fetched home successfully');
        }
        return res;
      }),
      catchError((err: HttpErrorResponse) => {
        this.notificationService.dispatchErrorMessage(err.message);
        return buildErrorObservable(err);
      })
    );
  }
}
