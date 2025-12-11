import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { TransferDto } from '../DTOs/TransferDtos';
import { WalletSummaryDto } from '../DTOs/WalletDtos';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  public getWallet(page: number = 1, size: number = 5): Observable<WalletSummaryDto> {
    let parameters = new HttpParams();
    parameters = parameters.set('page', page.toString());
    parameters = parameters.set('size', size.toString());

    return this.http
      .get<WalletSummaryDto>(`${this.apiUrl}/wallet`, {
        params: parameters,
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          console.error('getWallet API error:', err);
          return throwError(() => new Error('Wallet could not be loaded.'));
        })
      );
  }

  public postTransfer(transferDto: TransferDto): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/transfer`, transferDto, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          console.error('getWallet API error:', err);
          return throwError(() => new Error('Transfer failed.'));
        })
      );
  }
}
