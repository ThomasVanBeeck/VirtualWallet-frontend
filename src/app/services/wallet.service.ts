import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { WalletSummaryDTO } from '../DTOs/WalletDTOs';
import { HoldingSummaryDTO } from '../DTOs/HoldingDTOs';
import {
  TransferDTO,
  TransfersPaginatedDTO,
  TransferSummaryDTO,
} from '../DTOs/TransferDTOs';
import { AuthService } from './auth.service';
import { SessionstorageService } from './sessionstorage.service';

// TODO: transfer post failed bij withdrawal groter dan het beschikbare bedrag (=OK)
// zowel in frontend form controle als in backend

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  constructor() {
    this.createMockData(7);
    this.mockWallet.transferPage = {
      transfers: this.mockTransferList,
      pageNumber: 1,
      totalPages: this.mockTransferList.length,
    };

    let totalCash = 0;
    for (const tf of this.mockTransferList) {
      if (tf.type === 'Deposit') totalCash += tf.amount;
      else totalCash -= tf.amount;
    }
    this.mockWallet.totalCash = totalCash;
  }

  http = inject(HttpClient);
  sessionstorage = inject(SessionstorageService);
  authService = inject(AuthService);

  private apiUrl = environment.apiUrl;
  private readonly WALLET_CACHE_KEY = 'wallet';

  private mockHolding1: HoldingSummaryDTO = {
    stockName: 'TSLA',
    amount: 7,
    currentPrice: 99,
    totalValue: 693,
    totalProfit: 185.85,
    winLossPct: 36.65,
  };

  private mockTransferList: TransferSummaryDTO[] = [];

  public mockWallet: WalletSummaryDTO = {
    holdings: [this.mockHolding1],
    transferPage: { transfers: [], pageNumber: 0, totalPages: 0 },
    totalCash: 0,
    totalInStocks: 10685.85,
    totalProfit: 185.85,
    winLossPct: 1.77,
  };

  private createMockData(num: number): void {
    if (!environment.mockApi) return;

    const firstTransfer: TransferSummaryDTO = {
      date: new Date().toISOString(),
      amount: 50000,
      type: 'Deposit',
    };
    this.mockTransferList.unshift(firstTransfer);

    for (let i = 0; i < num; i++) {
      const randomAmount: number = Math.floor((Math.random() * 10 + 1) * 5);
      let randomType: string = 'Deposit';
      if (randomAmount % 2 == 0) randomType = 'Withdrawal';
      const transfer1: TransferSummaryDTO = {
        date: new Date().toISOString(),
        amount: randomAmount,
        type: randomType,
      };
      this.mockTransferList.unshift(transfer1);
    }
    console.log(
      `Mock Transfer List total: ${this.mockTransferList.length} transfers.`
    );
  }

  public emptyWalletCache() {
    this.sessionstorage.removeItem(this.WALLET_CACHE_KEY);
  }

  public getWallet(page: number, size: number): Observable<WalletSummaryDTO> {
    const cachedWallet = this.sessionstorage.getItem<WalletSummaryDTO>(
      this.WALLET_CACHE_KEY
    );

    if (cachedWallet) {
      if (environment.mockApi)
        console.log('Wallet retriever from session cache.');
      return of(cachedWallet);
    }

    if (environment.mockApi) {
      console.log('mock getWallet');
      if (this.authService.isMockLoggedIn) {
        const startIndex = (page - 1) * size;
        const endIndex = page * size;
        const totalItems = this.mockTransferList.length;
        const totalPages: number = Math.ceil(totalItems / size);

        let transfers: TransferSummaryDTO[];

        if (startIndex >= totalItems) {
          transfers = [];
        } else
          transfers = this.mockTransferList.slice(
            startIndex,
            startIndex + size
          );

        const transfersPaginatedDTO: TransfersPaginatedDTO = {
          transfers: transfers,
          pageNumber: page,
          totalPages: totalPages,
        };
        this.mockWallet.transferPage = transfersPaginatedDTO;

        return of(this.mockWallet);
      }
      return throwError(() => new Error('Unauthorized, not mock logged in.'));
    } // End of Mocking
    else {
      let parameters = new HttpParams();
      parameters = parameters.set('page', page.toString());
      parameters = parameters.set('size', size.toString());

      return this.http
        .get<WalletSummaryDTO>(`${this.apiUrl}/wallet`, {
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
  }

  public postTransfer(transferDTO: TransferDTO): Observable<void> {
    if (environment.mockApi) {
      console.log('mock postTransfer');
      if (this.authService.isMockLoggedIn) {
        const newTransfer: TransferSummaryDTO = {
          amount: transferDTO.amount,
          date: `1999-01-01T01:00:00Z`,
          type: transferDTO.type,
        };

        if (
          newTransfer.type === 'Withdrawal' &&
          newTransfer.amount > this.mockWallet.totalCash
        )
          return throwError(() => new Error('insufficient mock funds.'));

        if (newTransfer.type === 'Withdrawal')
          this.mockWallet.totalCash -= newTransfer.amount;
        else this.mockWallet.totalCash += newTransfer.amount;

        this.mockTransferList.unshift(newTransfer);
        return of(void 0);
      }
      return throwError(() => new Error('Mock transfer failed.'));
    }
    // End of Mocking
    else {
      return this.http
        .post<void>(`${this.apiUrl}/transfer`, transferDTO, {
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
}
