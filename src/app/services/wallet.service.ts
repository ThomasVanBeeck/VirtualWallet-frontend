import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, of, throwError } from 'rxjs';
import { WalletSummaryDTO } from '../DTOs/WalletDTOs';
import { HoldingSummaryDTO } from '../DTOs/HoldingDTOs';
import { TransferDTO, TransferSummaryDTO } from '../DTOs/TransferDTOs';
import { AuthService } from './auth.service';

// TODO: transfer post failed bij withdrawal groter dan het beschikbare bedrag
// zowel in frontend form controle als in backend 


@Injectable({
  providedIn: 'root',
})
export class WalletService {

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

  mockTransfer1: TransferSummaryDTO = {
    Amount: 10000,
    Date: "money transfer date 1",
    Type: "Deposit"
  }

  mockTransfer2: TransferSummaryDTO = {
    Amount: 500,
    Date: "money transfer date 2",
    Type: "Withdrawal"
  }

  mockWallet: WalletSummaryDTO = {
    Holdings: [this.mockHolding1],
    Transfers: [this.mockTransfer1, this.mockTransfer2],
    TotalCash: 10500,
    TotalValue: 10685.85,
    TotalProfit: 185.85,
    WinLossPct: 1.77
  }
  
  public getWallet(): Observable<WalletSummaryDTO> {
    if (environment.mockApi) {
      console.log("mock getWallet")
      if (this.authService.isMockLoggedIn)
        return of(this.mockWallet)
      return throwError(() => ({ status: 401 }))
    }
    return this.http.get<WalletSummaryDTO>(`${this.apiUrl}/wallet`,
      { withCredentials: true }
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
          return throwError(() => ({ status: 401 }))

        if (newTransfer.Type === "Withdrawal")
          this.mockWallet.TotalCash -= newTransfer.Amount
        else this.mockWallet.TotalCash += newTransfer.Amount

        this.mockWallet.Transfers.push(newTransfer)
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