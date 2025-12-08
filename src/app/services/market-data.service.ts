import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { StockModel } from '../models/stockmodel';
import { SessionstorageService } from './sessionstorage.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MarketDataService {
  http = inject(HttpClient);
  authService = inject(AuthService);
  sessionstorage = inject(SessionstorageService);

  private apiUrl = environment.apiUrl;
  private readonly STOCKDATA_CACHE_KEY = 'stockdata';

  private mockStockData1: StockModel = {
    stockName: 'Bitcoin',
    type: 'Cryptocurrency',
    description: 'Largest cryptocurrency',
    pricePerShare: 99123,
    changePct24Hr: 12.34,
    pctOfWallet: 77.77,
    sharesAmount: 0.2,
    investmentAmount: 13877.22,
  };

  private mockStockData2: StockModel = {
    stockName: 'Nvidia',
    type: 'stock',
    description: 'Big tech chip maker',
    pricePerShare: 201.06,
    changePct24Hr: -2.34,
    pctOfWallet: 22.23,
    sharesAmount: 5,
    investmentAmount: 666.66,
  };

  private MockStockDataList: StockModel[] = [
    this.mockStockData1,
    this.mockStockData2,
  ];

  public getStockData(): Observable<StockModel[]> {
    const cachedList = this.sessionstorage.getItem<Array<StockModel>>(
      this.STOCKDATA_CACHE_KEY
    );

    if (environment.mockApi) {
      if (this.authService.isMockLoggedIn) {
        if (cachedList) {
          console.log('StockModel data retrieved from session cache.');
          return of(cachedList);
        } else {
          console.log('Saving mock data to session storage.');
          this.sessionstorage.setItem(
            this.STOCKDATA_CACHE_KEY,
            this.MockStockDataList
          );
          return of(this.MockStockDataList);
        }
      }
      return throwError(() => new Error('Mock getStockData failed.'));
    } else {
      if (cachedList) return of(cachedList);
      else {
        return this.http
          .get<StockModel[]>(`${this.apiUrl}/stock/all`, {
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
