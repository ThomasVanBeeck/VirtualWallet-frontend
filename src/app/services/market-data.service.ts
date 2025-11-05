import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { StockModel } from '../models/stockmodel';




@Injectable({
  providedIn: 'root'
})
export class MarketDataService {

  http = inject(HttpClient)

  private apiUrl = environment.apiUrl

  private mockStockData1: StockModel = {
    stockname: "Bitcoin",
    type: "Cryptocurrency",
    price_per_share: 99123,
    change_pct_24hr: 12.34,
    pct_of_wallet: 77.77,
    shares_amount: 0.2,
    investment_amount: 13877.22
  }

    private mockStockData2: StockModel = {
    stockname: "Nvidia",
    type: "stock",
    price_per_share: 201.06,
    change_pct_24hr: -2.34,
    pct_of_wallet: 22.23,
    shares_amount: 5,
    investment_amount: 666.66
  }

  private MockStockDataList: Array<StockModel> = [this.mockStockData1, this.mockStockData2]


  public getStockData(): Observable<StockModel> {
    if (environment.mockApi) {
      console.log("mocking getStockData");
      return of(this.mockStockData1);
    }
    else
      // TODO: concreter uitwerken
      return this.http.get<StockModel>(this.apiUrl + '/stockdata')
  }
}
