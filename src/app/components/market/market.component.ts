import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, Signal, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, switchMap, tap } from 'rxjs';
import { StockDto, StockUpdateDto } from '../../DTOs/StockDTOs';
import { MarketDataService } from '../../services/market-data.service';

@Component({
  selector: 'app-market',
  imports: [DecimalPipe, CommonModule],
  templateUrl: './market.component.html',
  styleUrl: './market.component.css',
})
export class MarketComponent {
  marketDataService = inject(MarketDataService);

  stockLastUpdate: Signal<StockUpdateDto> = toSignal(
    this.marketDataService.getLastUpdate(),
    {
      initialValue: { lastUpdate: '' },
    }
  );
  private stockDataObservable$: Observable<StockDto[]> = toObservable(
    this.stockLastUpdate
  ).pipe(
    tap(() => this.marketDataService.emptyStockDataCache()),
    switchMap(() => this.marketDataService.getStockData())
  );

  stockData: Signal<StockDto[]> = toSignal(this.stockDataObservable$, {
    initialValue: [],
  });
}
