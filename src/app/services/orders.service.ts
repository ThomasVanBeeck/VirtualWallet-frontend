import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { OrderDto, OrderPostDto, OrdersPaginatedDto } from '../DTOs/OrderDtos';
import { IOrdersService } from '../interfaces/i-orders.service';

@Injectable({
  providedIn: 'root',
})
export class OrdersService implements IOrdersService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  mockOrder1: OrderDto = {
    stockName: 'Tesla',
    date: new Date().toISOString(),
    type: 'Buy',
    price: 123.45,
    amount: 5,
    total: 123.45 * 5,
  };

  mockOrder2: OrderDto = {
    stockName: 'Bitcoin',
    date: new Date().toISOString(),
    type: 'Sell',
    price: 234.56,
    amount: 3,
    total: 234.56 * 3,
  };

  mockOrderList: OrderDto[] = [];

  public getOrderHistory(page: number, size: number): Observable<OrdersPaginatedDto> {
    let parameters = new HttpParams();
    parameters = parameters.set('page', page.toString());
    parameters = parameters.set('size', size.toString());

    return this.http
      .get<OrdersPaginatedDto>(`${this.apiUrl}/order`, {
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

  public postOrder(orderPostDto: OrderPostDto): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/order`, orderPostDto, {
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
