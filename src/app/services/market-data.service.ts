import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  catchError,
  map,
  Observable,
  of,
  pairwise,
  startWith,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { environment } from '../../environments/environment';
import { StockDto, StockUpdateDto } from '../DTOs/StockDtos';
import { IMarketDataService } from '../interfaces/i-market-data.service';
import { SessionstorageService } from './sessionstorage.service';

@Injectable({
  providedIn: 'root',
})
export class MarketDataService implements IMarketDataService {
  private http = inject(HttpClient);
  private sessionstorage = inject(SessionstorageService);

  private apiUrl = environment.apiUrl;
  private readonly STOCKDATA_CACHE_KEY = 'stockdata';

  updateSignal = signal<StockUpdateDto>({ lastUpdate: '' });

  public emptyStockDataCache(): void {
    this.sessionstorage.removeItem(this.STOCKDATA_CACHE_KEY);
  }

  public getStockDataWithUpdateCheck(): Observable<StockDto[]> {
    return this.getLastUpdate().pipe(switchMap(() => this.getStockData()));
  }

  public getLastUpdate(): Observable<StockUpdateDto> {
    return this.http
      .get<StockUpdateDto>(`${this.apiUrl}/stock/lastupdate`, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          console.error('getStockUpdate API error: ', err);
          return throwError(() => err);
        }),
        startWith({ lastUpdate: this.updateSignal().lastUpdate } as StockUpdateDto),
        pairwise(),
        tap(([prev, curr]) => {
          if (prev.lastUpdate !== curr.lastUpdate) {
            this.emptyStockDataCache();
          }
          this.updateSignal().lastUpdate = curr.lastUpdate;
        }),
        map(([_, curr]) => curr)
      );
  }

  public getStockData(): Observable<StockDto[]> {
    const cachedList = this.sessionstorage.getItem<Array<StockDto>>(this.STOCKDATA_CACHE_KEY);

    if (cachedList) {
      console.log('cached stock data retrieved.');
      return of(cachedList);
    } else {
      return this.http
        .get<StockDto[]>(`${this.apiUrl}/stock/all`, {
          withCredentials: true,
        })
        .pipe(
          tap((dataList) => {
            this.sessionstorage.setItem(this.STOCKDATA_CACHE_KEY, dataList);
            console.log(dataList);
          }),
          catchError((err) => {
            console.error('getStockData API error: ', err);
            return throwError(() => err);
          })
        );
    }
  }
}
