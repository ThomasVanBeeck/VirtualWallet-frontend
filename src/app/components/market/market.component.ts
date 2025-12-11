import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { StockDto, StockUpdateDto } from '../../DTOs/StockDtos';
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

  stockLastUpdate: Signal<StockUpdateDto> = toSignal(this.marketDataService.getLastUpdate(), {
    initialValue: { lastUpdate: '' },
  });

  stockData: Signal<StockDto[]> = toSignal(this.marketDataService.getStockData(), {
    initialValue: [],
  });
}
