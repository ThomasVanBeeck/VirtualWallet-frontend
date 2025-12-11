import { Observable } from 'rxjs';
import { StockDto, StockUpdateDto } from '../DTOs/StockDtos';

export interface IMarketDataService {
  emptyStockDataCache(): void;
  getLastUpdate(): Observable<StockUpdateDto>;
  getStockData(): Observable<StockDto[]>;
}
