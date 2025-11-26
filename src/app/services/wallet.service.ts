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
    this.createMockData(30);
    this.mockWallet.TransferPage = {
      Transfers: this.mockTransferList,
      PageNumber: 1,
      TotalPages: this.mockTransferList.length,
    };

    let totalCash = 0;
    for (const tf of this.mockTransferList) {
      if (tf.Type === 'Deposit') totalCash += tf.Amount;
      else totalCash -= tf.Amount;
    }
    this.mockWallet.TotalCash = totalCash;
  }

  http = inject(HttpClient);
  sessionstorage = inject(SessionstorageService);
  authService = inject(AuthService);

  private apiUrl = environment.apiUrl;
  private readonly WALLET_CACHE_KEY = 'wallet';

  private mockHolding1: HoldingSummaryDTO = {
    StockName: 'TSLA',
    Amount: 7,
    AvgPrice: 72.45,
    CurrentPrice: 99,
    TotalValue: 693,
    TotalProfit: 185.85,
    WinLossPct: 36.65,
  };

  private mockTransferList: TransferSummaryDTO[] = [];

  private mockWallet: WalletSummaryDTO = {
    Holdings: [this.mockHolding1],
    TransferPage: { Transfers: [], PageNumber: 0, TotalPages: 0 },
    TotalCash: 0,
    TotalValue: 10685.85,
    TotalProfit: 185.85,
    WinLossPct: 1.77,
  };

  private createMockData(num: number): void {
    const firstTransfer: TransferSummaryDTO = {
      Date: `2025-11-20T${1 * 2}:00:00Z`,
      Amount: 50000,
      Type: 'Deposit',
    };
    this.mockTransferList.unshift(firstTransfer);

    for (let i = 0; i < num; i++) {
      const randomAmount: number = Math.floor((Math.random() * 10 + 1) * 5);
      let randomType: string = 'Deposit';
      if (randomAmount % 2 == 0) randomType = 'Withdrawal';
      const transfer1: TransferSummaryDTO = {
        Date: `2025-11-20T${i * 2}:00:00Z`,
        Amount: randomAmount,
        Type: randomType,
      };
      this.mockTransferList.unshift(transfer1);
    }
    console.log(
      `Mock Transfer List total: ${this.mockTransferList.length} transfers.`
    );
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
          Transfers: transfers,
          PageNumber: page,
          TotalPages: totalPages,
        };
        this.mockWallet.TransferPage = transfersPaginatedDTO;

        return of(this.mockWallet);
      }
      return throwError(() => new Error('Unauthorized, not mock logged in.'));
    } else {
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
          Amount: transferDTO.Amount,
          Date: 'determined by backend',
          Type: transferDTO.Type,
        };

        if (
          newTransfer.Type === 'Withdrawal' &&
          newTransfer.Amount > this.mockWallet.TotalCash
        )
          return throwError(() => new Error('insufficient mock funds.'));

        if (newTransfer.Type === 'Withdrawal')
          this.mockWallet.TotalCash -= newTransfer.Amount;
        else this.mockWallet.TotalCash += newTransfer.Amount;

        this.mockTransferList.unshift(newTransfer);
        return of(void 0);
      }
      return throwError(() => new Error('Mock transfer failed.'));
    }
    return this.http
      .post<void>(`${this.apiUrl}/wallet/transfer`, transferDTO, {
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
