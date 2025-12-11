import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
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
  private readonly STOCKLASTUPDATE_CACHE_KEY = 'stocklastupdate';

  private mockStockData1: StockDto = {
    stockName: 'Bitcoin',
    type: 'Cryptocurrency',
    description: 'Largest cryptocurrency',
    pricePerShare: 99123,
    changePct24Hr: 12.34,
    pctOfWallet: 77.77,
    sharesAmount: 0.2,
    investmentAmount: 13877.22,
  };

  private mockStockData2: StockDto = {
    stockName: 'Nvidia',
    type: 'stock',
    description: 'Big tech chip maker',
    pricePerShare: 201.06,
    changePct24Hr: -2.34,
    pctOfWallet: 22.23,
    sharesAmount: 5,
    investmentAmount: 666.66,
  };

  private MockStockDataList: StockDto[] = [this.mockStockData1, this.mockStockData2];

  private MockStockUpdateNewer: StockUpdateDto = {
    lastUpdate: 'newer second value',
  };

  public emptyStockDataCache(): void {
    this.sessionstorage.removeItem(this.STOCKDATA_CACHE_KEY);
  }

  public getLastUpdate(): Observable<StockUpdateDto> {
    const cachedDate = this.sessionstorage.getItem<StockUpdateDto>(this.STOCKLASTUPDATE_CACHE_KEY);

    if (this.mockstateService.isMockLoggedIn) {
      if (cachedDate && cachedDate.lastUpdate === this.MockStockUpdateNewer.lastUpdate) {
        console.log('Stock LAST UPDATE from session cache. No update yet.');
        return of(cachedDate);
      } else if (cachedDate && cachedDate.lastUpdate !== this.MockStockUpdateNewer.lastUpdate) {
        this.sessionstorage.removeItem(this.STOCKDATA_CACHE_KEY);
        console.log('LAST UPDATE is new, removed stocks from local cache.');
      } else {
        console.log('Saving stock LAST UPDATE to cache... Cache was empty.');
      }
      this.sessionstorage.setItem(this.STOCKLASTUPDATE_CACHE_KEY, this.MockStockUpdateNewer);
      return of(this.MockStockUpdateNewer);
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
        this.sessionstorage.setItem(this.STOCKDATA_CACHE_KEY, this.MockStockDataList);
        return of(this.MockStockDataList);
      }
    }
    return throwError(() => new Error('Mock getStockData failed.'));
  }
}
