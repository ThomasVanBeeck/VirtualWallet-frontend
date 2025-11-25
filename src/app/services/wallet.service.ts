import { HttpClient, HttpParams } from '@angular/common/http';
import { effect, inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { WalletSummaryDTO } from '../DTOs/WalletDTOs';
import { HoldingSummaryDTO } from '../DTOs/HoldingDTOs';
import { TransferDTO, TransfersPaginatedDTO, TransferSummaryDTO } from '../DTOs/TransferDTOs';
import { AuthService } from './auth.service';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';

// TODO: transfer post failed bij withdrawal groter dan het beschikbare bedrag (=OK)
// zowel in frontend form controle als in backend 


@Injectable({
  providedIn: 'root',
})
export class WalletService {

  constructor() {

    this.createMockData(30)
    this.mockWallet.TransferPage =  {
      Transfers: this.mockTransferList,
      PageNumber: 1,
      TotalPages: this.mockTransferList.length
    }

    let totalCash = 0
    for (const tf of this.mockTransferList) {
      if (tf.Type === "Deposit") totalCash += tf.Amount
      else totalCash -= tf.Amount
    }
    this.mockWallet.TotalCash = totalCash
  }

  http = inject(HttpClient)
  authService = inject(AuthService)

  private apiUrl = environment.apiUrl

  mockHolding1: HoldingSummaryDTO = {
    StockName: "TSLA",
    Amount: 7,
    AvgPrice: 72.45,
    CurrentPrice: 99,
    TotalValue: 693,
    TotalProfit: 185.85,
    WinLossPct: 36.65
  }

  mockTransferList: TransferSummaryDTO[] = []

  mockWallet: WalletSummaryDTO = {
    Holdings: [this.mockHolding1],
    TransferPage: { Transfers: [], PageNumber: 0, TotalPages: 0 },
    TotalCash: 0,
    TotalValue: 10685.85,
    TotalProfit: 185.85,
    WinLossPct: 1.77
  }

  private createMockData(num: number): void {
    const firstTransfer: TransferSummaryDTO = {
      Date: `2025-11-20T${1 * 2}:00:00Z`,
      Amount: 50000,
      Type: "Deposit"
    }
    this.mockTransferList.unshift(firstTransfer)

    for (let i = 0; i < num; i++) {
      const randomAmount: number = Math.floor((Math.random() * 10 + 1) * 5)
      let randomType: string = "Deposit"
      if (randomAmount % 2 == 0) randomType = "Withdrawal"
      const transfer1: TransferSummaryDTO = { Date: `2025-11-20T${i * 2}:00:00Z`,
        Amount: randomAmount,
        Type: randomType
      };
      this.mockTransferList.unshift(transfer1);
    }
    console.log(`Mock Transfer List total: ${this.mockTransferList.length} transfers.`);
  }
  
public getWallet(page: number, size: number): Observable<WalletSummaryDTO> {
    if (environment.mockApi) {
      console.log("mock getWallet")
      if (this.authService.isMockLoggedIn) {
        
        const startIndex = (page - 1) * size;
        const totalItems = this.mockTransferList.length;
        const totalPages: number = Math.ceil(totalItems / size);

        let transfers: TransferSummaryDTO[];

        if (startIndex >= totalItems) {
          transfers = []
        }
        else
          transfers = this.mockTransferList.slice(startIndex, startIndex + size)
        
        const transfersPaginatedDTO: TransfersPaginatedDTO = {
          Transfers: transfers,
          PageNumber: page,
          TotalPages: totalPages
        }
        this.mockWallet.TransferPage = transfersPaginatedDTO

        return of(this.mockWallet)
      }
      return throwError(() => ({ status: 401 }))
  }
  
  let parameters = new HttpParams()
  parameters = parameters.set('page', page.toString())
  parameters = parameters.set('size', size.toString())
  
    return this.http.get<WalletSummaryDTO>(`${this.apiUrl}/wallet`,
      { params: parameters, withCredentials: true }
    )
  }

  public postTransfer(transferDTO: TransferDTO): Observable<void> {
    if (environment.mockApi) {
      console.log("mock postTransfer")
      if (this.authService.isMockLoggedIn) {
        const newTransfer: TransferSummaryDTO = {
          Amount: transferDTO.Amount,
          Date: "determined by backend",
          Type: transferDTO.Type
        }

        if (newTransfer.Type === "Withdrawal" && newTransfer.Amount > this.mockWallet.TotalCash)
          return throwError(() => ({ status: 400, message: "Insufficient Funds" }))

        if (newTransfer.Type === "Withdrawal")
          this.mockWallet.TotalCash -= newTransfer.Amount
        else this.mockWallet.TotalCash += newTransfer.Amount

        this.mockTransferList.unshift(newTransfer)
        return of(undefined)
      }
      
      return throwError(() => ({ status: 401 }))
    }
    return this.http.post<void>(`${this.apiUrl}/wallet/transfer`,
    transferDTO,
      { withCredentials: true }
    )
  }
}