import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { TransferDto } from '../DTOs/TransferDtos';
import { WalletSummaryDto } from '../DTOs/WalletDtos';
import { SessionstorageService } from './sessionstorage.service';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private http = inject(HttpClient);
  private sessionstorage = inject(SessionstorageService);

  private apiUrl = environment.apiUrl;
  private readonly WALLET_CACHE_KEY = 'wallet';

  public emptyWalletCache(): void {
    this.sessionstorage.removeItem(this.WALLET_CACHE_KEY);
  }

  public getWallet(page: number, size: number): Observable<WalletSummaryDto> {
    const cachedWallet = this.sessionstorage.getItem<WalletSummaryDto>(this.WALLET_CACHE_KEY);

    if (cachedWallet) {
      return of(cachedWallet);
    }

    let parameters = new HttpParams();
    parameters = parameters.set('page', page.toString());
    parameters = parameters.set('size', size.toString());

    return this.http
      .get<WalletSummaryDto>(`${this.apiUrl}/wallet`, {
        params: parameters,
        withCredentials: true,
      })
      .pipe(
        tap((wallet) => {
          this.sessionstorage.setItem(this.WALLET_CACHE_KEY, wallet);
        }),
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
