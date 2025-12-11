import { inject, Injectable, signal } from '@angular/core';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { StockDto, StockUpdateDto } from '../DTOs/StockDtos';
import { IMarketDataService } from '../interfaces/i-market-data.service';
import { MockstateService } from './mockstate.service';
import { SessionstorageService } from './sessionstorage.service';

@Injectable({
  providedIn: 'root',
})
export class MarketDatamockService implements IMarketDataService {
  private mockstateService = inject(MockstateService);
  private sessionstorage = inject(SessionstorageService);

  private readonly STOCKDATA_CACHE_KEY = 'stockdata';

  updateSignal = signal<StockUpdateDto>({ lastUpdate: '' });

  public emptyStockDataCache(): void {
    this.sessionstorage.removeItem(this.STOCKDATA_CACHE_KEY);
  }

  public getStockDataWithUpdateCheck(): Observable<StockDto[]> {
    return this.getLastUpdate().pipe(switchMap(() => this.getStockData()));
  }

  public getLastUpdate(): Observable<StockUpdateDto> {
    if (this.mockstateService.isMockLoggedIn) {
      if (
        this.updateSignal().lastUpdate !== this.mockstateService.MockStockUpdateNewer.lastUpdate
      ) {
        this.sessionstorage.removeItem(this.STOCKDATA_CACHE_KEY);
        this.updateSignal().lastUpdate = this.mockstateService.MockStockUpdateNewer.lastUpdate;
        console.log('LAST UPDATE is new, removed stocks from local cache.');
      }

      return of(this.updateSignal());
    }
    return throwError(() => new Error('Mock getLastUpdate failed.'));
  }

  public getStockData(): Observable<StockDto[]> {
    const cachedList = this.sessionstorage.getItem<Array<StockDto>>(this.STOCKDATA_CACHE_KEY);

    if (this.mockstateService.isMockLoggedIn) {
      if (cachedList) {
        console.log('Stock data retrieved from session cache.');
        return of(cachedList);
      } else {
        console.log(cachedList);
        console.log('Saving stock mock data to session storage.');
        this.sessionstorage.setItem(
          this.STOCKDATA_CACHE_KEY,
          this.mockstateService.MockStockDataList
        );
        return of(this.mockstateService.MockStockDataList);
      }
    }
    return throwError(() => new Error('Mock getStockData failed.'));
  }
}
