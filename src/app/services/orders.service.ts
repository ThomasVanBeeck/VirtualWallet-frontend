import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { OrderDTO } from '../DTOs/OrderDTOs';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  http = inject(HttpClient)
  authService = inject(AuthService)

  private apiUrl = environment.apiUrl

  mockOrder1: OrderDTO = {
    StockName: "Tesla",
    OrderDate: "determined by backend",
    Type: "Buy",
    Price: 123.45,
    Amount: 5
  }

  mockOrder2: OrderDTO = {
    StockName: "Tesla",
    OrderDate: "determined by backend",
    Type: "Sell",
    Price: 234.56,
    Amount: 3
  }

  mockOrderList: OrderDTO[] = [this.mockOrder1, this.mockOrder2]
  
  //public getOrderHistory(): Observable<OrderDTO[]>

}
