import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { WalletDTO } from '../DTOs/WalletDTOs';
import { OrderDTO } from '../DTOs/OrderDTOs';
import { HoldingDTO } from '../DTOs/HoldingDTOs';
import { TransferDTO } from '../DTOs/TransferDTOs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WalletService {

  http = inject(HttpClient)
  authService = inject(AuthService)

  private apiUrl = environment.apiUrl

  public mockOrder1: OrderDTO = {
    OrderDate: "orderdate 1",
    Type: "OrderType",
    Price: 666.66,
    Amount: 6
  }

  public mockOrder2: OrderDTO = {
    OrderDate: "orderdate 2",
    Type: "OrderType",
    Price: 222.22,
    Amount: 2
  }

  public mockHolding1: HoldingDTO = {
    StockName: "TSLA",
    Orders: [this.mockOrder1, this.mockOrder2]
  }

  public mockTransfer1: TransferDTO = {
    Amount: 10000,
    OrderDate: "money transfer date 1",
    Type: "Deposit"
  }

  public mockTransfer2: TransferDTO = {
    Amount: 500,
    OrderDate: "money transfer date 2",
    Type: "Withdrawal"
  }

  public mockWallet: WalletDTO = {
    Holdings: [this.mockHolding1],
    Transfers: [this.mockTransfer1, this.mockTransfer2]
  }
  
  public getWallet(): Observable<WalletDTO> {
    if (environment.mockApi) {
      console.log("mock getWallet")
      if (this.authService.isMockLoggedIn)
        return of(this.mockWallet)
    }
    return this.http.get<WalletDTO>(`${this.apiUrl}/wallet`,
      { withCredentials: true }
    )
  }
}
