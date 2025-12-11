import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { StockDto, StockUpdateDto } from '../DTOs/StockDtos';

export interface IMarketDataService {
  getStockDataWithUpdateCheck(): Observable<StockDto[]>;
  emptyStockDataCache(): void;
  getLastUpdate(): Observable<StockUpdateDto>;
  getStockData(): Observable<StockDto[]>;
  updateSignal: Signal<StockUpdateDto>;
}
