import { Component, OnInit, inject } from '@angular/core';
import { MarketDataService } from '../../services/market-data.service';
import { StockModel } from '../../models/stockmodel';
import { Observable } from 'rxjs';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-market',
  imports: [DecimalPipe, CommonModule],
  templateUrl: './market.component.html',
  styleUrl: './market.component.css',
})
export class MarketComponent implements OnInit {
  marketData = inject(MarketDataService)

  ngOnInit(): void {
    this.fetchMarketData()
  }

  stockData$!: Observable<StockModel[] | undefined>

  fetchMarketData(): void {
    this.stockData$ = this.marketData.getStockData()
  }
}