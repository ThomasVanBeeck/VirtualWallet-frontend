import { Component, OnInit, Signal, inject } from '@angular/core';
import { MarketDataService } from '../../services/market-data.service';
import { StockModel } from '../../models/stockmodel';
import { CommonModule, DecimalPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-market',
  imports: [DecimalPipe, CommonModule],
  templateUrl: './market.component.html',
  styleUrl: './market.component.css',
})
export class MarketComponent {
  marketData = inject(MarketDataService);
  stockData: Signal<StockModel[]> = toSignal(this.marketData.getStockData(), {
    initialValue: [],
  });
}
