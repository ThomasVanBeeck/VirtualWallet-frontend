import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../environments/environment';

export interface StockData {
  stockname: string;
  price: number;
  changepct_24hr: number;
}


@Injectable({
  providedIn: 'root'
})
export class MarketDataService {

  private apiUrl = environment.apiUrl

  private mockStockData: StockData = {
    stockname: "Bitcoin",
    price: 99123,
    changepct_24hr: 12.34
  }

  constructor(private http: HttpClient) { }

  public getStockData(): Observable<StockData> {
    if (environment.mockApi) {
      console.log("mocking getStockData");
      return of(this.mockStockData);
    }
    else
      // TODO: concreter uitwerken
      return this.http.get<StockData>(this.apiUrl + '/stockdata')
  }
}
