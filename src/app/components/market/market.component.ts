import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { StockDto } from '../../DTOs/StockDtos';
import { IMarketDataService } from '../../interfaces/i-market-data.service';
import { MARKETDATA_SERVICE_TOKEN } from '../../tokens';

@Component({
  selector: 'app-market',
  imports: [DecimalPipe, CommonModule],
  templateUrl: './market.component.html',
  styleUrl: './market.component.css',
})
export class MarketComponent {
  private marketDataService = inject<IMarketDataService>(MARKETDATA_SERVICE_TOKEN);

  stockData: Signal<StockDto[]> = toSignal(this.marketDataService.getStockDataWithUpdateCheck(), {
    initialValue: [],
  });

  lastUpdate: Signal<string> = toSignal(
    this.marketDataService.getLastUpdate().pipe(map((dto) => dto.lastUpdate)),
    {
      initialValue: '',
    }
  );
}
