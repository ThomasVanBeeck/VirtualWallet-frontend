import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { StockDto, StockUpdateDto } from '../DTOs/StockDTOs';
import { AuthService } from './auth.service';
import { SessionstorageService } from './sessionstorage.service';

@Injectable({
  providedIn: 'root',
})
export class MarketDataService {
  http = inject(HttpClient);
  authService = inject(AuthService);
  sessionstorage = inject(SessionstorageService);

  private apiUrl = environment.apiUrl;
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

  private MockStockDataList: StockDto[] = [
    this.mockStockData1,
    this.mockStockData2,
  ];

  private MockStockUpdate: StockUpdateDto = { lastUpdate: 'first value' };
  private MockStockUpdateNewer: StockUpdateDto = {
    lastUpdate: 'newer second value',
  };

  public emptyStockDataCache() {
    this.sessionstorage.removeItem(this.STOCKDATA_CACHE_KEY);
  }

  public getLastUpdate(): Observable<StockUpdateDto> {
    const cachedDate = this.sessionstorage.getItem<StockUpdateDto>(
      this.STOCKLASTUPDATE_CACHE_KEY
    );

    if (environment.mockApi) {
      if (this.authService.isMockLoggedIn) {
        if (
          cachedDate &&
          cachedDate.lastUpdate == this.MockStockUpdateNewer.lastUpdate
        ) {
          console.log('Stock Last Update info retriever from session cache.');
          return of(cachedDate);
        } else if (
          cachedDate &&
          cachedDate.lastUpdate !== this.MockStockUpdateNewer.lastUpdate
        ) {
          this.sessionstorage.removeItem(this.STOCKDATA_CACHE_KEY);
        } else {
          console.log('Saving stock last update mock data to session storage.');
        }
        this.sessionstorage.setItem(
          this.STOCKLASTUPDATE_CACHE_KEY,
          this.MockStockUpdateNewer
        );
        return of(this.MockStockUpdateNewer);
      }
      return throwError(() => new Error('Mock getLastUpdate failed.'));
    }

    // Einde mocking
    else {
      return this.http
        .get<StockUpdateDto>(`${this.apiUrl}/stock/lastupdate`, {
          withCredentials: true,
        })
        .pipe(
          tap((stockUpdateDto) => {
            this.sessionstorage.setItem(
              this.STOCKLASTUPDATE_CACHE_KEY,
              stockUpdateDto
            );
            console.log(stockUpdateDto);
          }),
          catchError((err) => {
            console.error('getStockUpdate API error: ', err);
            return throwError(() => err);
          })
        );
    }
  }

  public getStockData(): Observable<StockDto[]> {
    const cachedList = this.sessionstorage.getItem<Array<StockDto>>(
      this.STOCKDATA_CACHE_KEY
    );

    if (environment.mockApi) {
      if (this.authService.isMockLoggedIn) {
        if (cachedList) {
          console.log('Stock data retrieved from session cache.');
          return of(cachedList);
        } else {
          console.log('Saving stock mock data to session storage.');
          this.sessionstorage.setItem(
            this.STOCKDATA_CACHE_KEY,
            this.MockStockDataList
          );
          return of(this.MockStockDataList);
        }
      }
      return throwError(() => new Error('Mock getStockData failed.'));
    } // Einde mocking
    else {
      if (cachedList) return of(cachedList);
      else {
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
}
