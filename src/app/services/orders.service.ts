import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { OrderDTO, OrderPostDTO, OrdersPaginatedDTO } from '../DTOs/OrderDTOs';
import { catchError, Observable, of, throwError } from 'rxjs';
import { WalletService } from './wallet.service';
import { HoldingSummaryDTO } from '../DTOs/HoldingDTOs';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor() {
    if (environment.mockApi) this.createMockData(6);
  }

  http = inject(HttpClient);
  authService = inject(AuthService);
  walletService = inject(WalletService);

  private apiUrl = environment.apiUrl;

  mockOrder1: OrderDTO = {
    stockName: 'Tesla',
    date: new Date().toISOString(),
    type: 'Buy',
    price: 123.45,
    amount: 5,
    total: 123.45 * 5,
  };

  mockOrder2: OrderDTO = {
    stockName: 'Bitcoin',
    date: new Date().toISOString(),
    type: 'Sell',
    price: 234.56,
    amount: 3,
    total: 234.56 * 3,
  };

  mockOrderList: OrderDTO[] = [];

  private createMockData(numSets: number): void {
    if (!environment.mockApi) return;

    for (let i = 0; i < numSets; i++) {
      const randomAmount: number = Math.floor(Math.random() * 10 + 1);
      let randomType: string = 'Sell';
      if (randomAmount % 2 == 0) randomType = 'Buy';
      const order1: OrderDTO = {
        ...this.mockOrder1,
        date: new Date().toISOString(),
        price: this.mockOrder1.price + i * 0.1,
        amount: randomAmount,
        type: randomType,
        total: (this.mockOrder1.price + i * 0.1) * randomAmount,
      };
      const order2: OrderDTO = {
        ...this.mockOrder2,
        date: new Date().toISOString(),
        price: this.mockOrder2.price - i * 0.1,
        amount: randomAmount,
        type: randomType,
        total: (this.mockOrder2.price - i * 0.1) * randomAmount,
      };

      this.mockOrderList.push(order1);
      this.mockOrderList.push(order2);
    }
    console.log(`Mock Order List total: ${this.mockOrderList.length} orders.`);
  }

  public getOrderHistory(
    page: number,
    size: number
  ): Observable<OrdersPaginatedDTO> {
    if (environment.mockApi) {
      console.log('mocking getOrderHistory');

      if (this.authService.isMockLoggedIn) {
        const startIndex = (page - 1) * size;
        const totalItems = this.mockOrderList.length;
        let totalPages: number = Math.ceil(totalItems / size);

        let orders: OrderDTO[];

        if (startIndex >= totalItems) {
          orders = [];
        } else orders = this.mockOrderList.slice(startIndex, startIndex + size);

        const ordersPaginatedDTO: OrdersPaginatedDTO = {
          orders: orders,
          pageNumber: page,
          totalPages: totalPages,
        };
        return of(ordersPaginatedDTO);
      }
      return throwError(() => new Error('Mock getOrderHistory failed.'));
    } else {
      let parameters = new HttpParams();
      parameters = parameters.set('page', page.toString());
      parameters = parameters.set('size', size.toString());

      return this.http
        .get<OrdersPaginatedDTO>(`${this.apiUrl}/order`, {
          params: parameters,
          withCredentials: true,
        })
        .pipe(
          catchError((err) => {
            console.error('getOrderHistory API error:', err);
            return throwError(() => err);
          })
        );
    }
  }

  public postOrder(orderPostDTO: OrderPostDTO): Observable<void> {
    if (environment.mockApi) {
      const orderCashTotal = orderPostDTO.price * orderPostDTO.amount;
      if (
        this.walletService.mockWallet.totalCash < orderCashTotal &&
        orderPostDTO.type === 'Buy'
      )
        return throwError(
          () => new Error('Insufficient amount of cash available.')
        );
      if (this.authService.isMockLoggedIn) {
        const newOrder: OrderDTO = {
          stockName: orderPostDTO.stockName,
          date: '2025-11-20T08:00:00Z',
          type: orderPostDTO.type,
          price: orderPostDTO.price,
          amount: orderPostDTO.amount,
          total: orderCashTotal,
        };
        this.mockOrderList.unshift(newOrder);

        if (
          !this.walletService.mockWallet.holdings.some(
            (holding) => holding.stockName == orderPostDTO.stockName
          )
        ) {
          const newMockHolding: HoldingSummaryDTO = {
            stockName: orderPostDTO.stockName,
            amount: orderPostDTO.amount,
            currentPrice: orderPostDTO.price,
            totalValue: orderCashTotal,
            totalProfit: 0,
            winLossPct: 0,
          };
          this.walletService.mockWallet.holdings.push(newMockHolding);
        }

        if (orderPostDTO.type === 'Buy')
          this.walletService.mockWallet.totalCash -=
            orderPostDTO.price * orderPostDTO.amount;
        else
          this.walletService.mockWallet.totalCash +=
            orderPostDTO.price * orderPostDTO.amount;

        return of(void 0);
      }
      return throwError(() => new Error('Mock postOrder failed.'));
    }
    // End of Mocking
    else {
      return this.http
        .post<void>(`${this.apiUrl}/order`, orderPostDTO, {
          withCredentials: true,
        })
        .pipe(
          catchError((err) => {
            console.error('postOrder API error:', err);
            return throwError(() => err);
          })
        );
    }
  }
}
