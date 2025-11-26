import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { OrderDTO, OrderPostDTO, OrdersPaginatedDTO } from '../DTOs/OrderDTOs';
import { catchError, Observable, of, throwError } from 'rxjs';
import { WalletService } from './wallet.service';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor() {
    this.createMockData(12);
  }

  http = inject(HttpClient);
  authService = inject(AuthService);
  walletService = inject(WalletService);

  private apiUrl = environment.apiUrl;

  mockOrder1: OrderDTO = {
    StockName: 'Tesla',
    OrderDate: new Date().toISOString(),
    Type: 'Buy',
    Price: 123.45,
    Amount: 5,
    Total: 123.45 * 5,
  };

  mockOrder2: OrderDTO = {
    StockName: 'Bitcoin',
    OrderDate: new Date().toISOString(),
    Type: 'Sell',
    Price: 234.56,
    Amount: 3,
    Total: 234.56 * 3,
  };

  mockOrderList: OrderDTO[] = [];

  private createMockData(numSets: number): void {
    for (let i = 0; i < numSets; i++) {
      const randomAmount: number = Math.floor(Math.random() * 10 + 1);
      let randomType: string = 'Sell';
      if (randomAmount % 2 == 0) randomType = 'Buy';
      const order1: OrderDTO = {
        ...this.mockOrder1,
        OrderDate: new Date().toISOString(),
        Price: this.mockOrder1.Price + i * 0.1,
        Amount: randomAmount,
        Type: randomType,
        Total: (this.mockOrder1.Price + i * 0.1) * randomAmount,
      };
      const order2: OrderDTO = {
        ...this.mockOrder2,
        OrderDate: new Date().toISOString(),
        Price: this.mockOrder2.Price - i * 0.1,
        Amount: randomAmount,
        Type: randomType,
        Total: (this.mockOrder2.Price - i * 0.1) * randomAmount,
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
        const endIndex = page * size;
        const totalItems = this.mockOrderList.length;
        let totalPages: number = Math.ceil(totalItems / size);

        let orders: OrderDTO[];

        if (startIndex >= totalItems) {
          orders = [];
        } else orders = this.mockOrderList.slice(startIndex, startIndex + size);

        const ordersPaginatedDTO: OrdersPaginatedDTO = {
          Orders: orders,
          PageNumber: page,
          TotalPages: totalPages,
        };
        return of(ordersPaginatedDTO);
      }
      return throwError(() => new Error('Mock getOrderHistory failed.'));
    } else {
      let parameters = new HttpParams();
      parameters = parameters.set('page', page.toString());
      parameters = parameters.set('size', size.toString());

      return this.http
        .get<OrdersPaginatedDTO>(`${this.apiUrl}/order/all`, {
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
      const orderCashTotal = orderPostDTO.Price * orderPostDTO.Amount;
      if (
        this.walletService.mockWallet.TotalCash < orderCashTotal &&
        orderPostDTO.Type === 'Buy'
      )
        return throwError(
          () => new Error('Insufficient amount of cash available.')
        );
      if (this.authService.isMockLoggedIn) {
        const newOrder: OrderDTO = {
          StockName: orderPostDTO.StockName,
          OrderDate: '2025-11-20T08:00:00Z',
          Type: orderPostDTO.Type,
          Price: orderPostDTO.Price,
          Amount: orderPostDTO.Amount,
          Total: orderCashTotal,
        };
        this.mockOrderList.unshift(newOrder);
        if (orderPostDTO.Type === 'Buy')
          this.walletService.mockWallet.TotalCash -=
            orderPostDTO.Price * orderPostDTO.Amount;
        else
          this.walletService.mockWallet.TotalCash +=
            orderPostDTO.Price * orderPostDTO.Amount;

        return of(void 0);
      }
      return throwError(() => new Error('Mock postOrder failed.'));
    } else {
      return this.http
        .post<void>(`${this.apiUrl}/order/submit`, orderPostDTO, {
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
