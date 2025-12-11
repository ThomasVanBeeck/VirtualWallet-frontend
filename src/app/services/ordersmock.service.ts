import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HoldingSummaryDto } from '../DTOs/HoldingDtos';
import { OrderDto, OrderPostDto, OrdersPaginatedDto } from '../DTOs/OrderDtos';
import { IOrdersService } from '../interfaces/i-orders.service';
import { MockstateService } from './mockstate.service';

@Injectable({
  providedIn: 'root',
})
export class OrdersmockService implements IOrdersService {
  private mockstateService = inject(MockstateService);

  public getOrderHistory(page: number, size: number): Observable<OrdersPaginatedDto> {
    console.log('mocking getOrderHistory');

    if (this.mockstateService.isMockLoggedIn) {
      const startIndex = (page - 1) * size;
      const totalItems = this.mockstateService.mockOrderList.length;
      let totalPages: number = Math.ceil(totalItems / size);

      let orders: OrderDto[];

      if (startIndex >= totalItems) {
        orders = [];
      } else orders = this.mockstateService.mockOrderList.slice(startIndex, startIndex + size);

      const ordersPaginatedDTO: OrdersPaginatedDto = {
        orders: orders,
        pageNumber: page,
        totalPages: totalPages,
      };
      return of(ordersPaginatedDTO);
    }
    return throwError(() => new Error('Mock getOrderHistory failed.'));
  }

  public postOrder(orderPostDto: OrderPostDto): Observable<void> {
    const orderCashTotal = orderPostDto.price * orderPostDto.amount;
    if (this.mockstateService.mockWallet.totalCash < orderCashTotal && orderPostDto.type === 'Buy')
      return throwError(() => new Error('Insufficient amount of cash available.'));
    if (this.mockstateService.isMockLoggedIn) {
      const newOrder: OrderDto = {
        stockName: orderPostDto.stockName,
        date: '2025-11-20T08:00:00Z',
        type: orderPostDto.type,
        price: orderPostDto.price,
        amount: orderPostDto.amount,
        total: orderCashTotal,
      };
      this.mockstateService.mockOrderList.unshift(newOrder);

      if (
        !this.mockstateService.mockWallet.holdings.some(
          (holding) => holding.stockName == orderPostDto.stockName
        )
      ) {
        const newMockHolding: HoldingSummaryDto = {
          stockName: orderPostDto.stockName,
          amount: orderPostDto.amount,
          currentPrice: orderPostDto.price,
          totalValue: orderCashTotal,
          totalProfit: 0,
          winLossPct: 0,
        };
        this.mockstateService.mockWallet.holdings.push(newMockHolding);
      }

      if (orderPostDto.type === 'Buy')
        this.mockstateService.mockWallet.totalCash -= orderPostDto.price * orderPostDto.amount;
      else this.mockstateService.mockWallet.totalCash += orderPostDto.price * orderPostDto.amount;

      return of(void 0);
    }
    return throwError(() => new Error('Mock postOrder failed.'));
  }
}
