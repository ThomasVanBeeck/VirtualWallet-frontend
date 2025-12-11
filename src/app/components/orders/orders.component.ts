import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, Signal, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, Observable, shareReplay, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HoldingNamePriceDto, HoldingSummaryDto } from '../../DTOs/HoldingDtos';
import { OrderDto, OrderPostDto, OrdersPaginatedDto } from '../../DTOs/OrderDtos';
import { StockUpdateDto } from '../../DTOs/StockDtos';
import { WalletSummaryDto } from '../../DTOs/WalletDtos';
import { IMarketDataService } from '../../interfaces/i-market-data.service';
import { IOrdersService } from '../../interfaces/i-orders.service';
import { IWalletService } from '../../interfaces/i-wallet.service';
import { MARKETDATA_SERVICE_TOKEN, ORDERS_SERVICE_TOKEN, WALLET_SERVICE_TOKEN } from '../../tokens';
import { commaToDot } from '../../validators/commatodot.validator';

@Component({
  selector: 'app-orders',
  imports: [DecimalPipe, ReactiveFormsModule, DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {
  constructor() {
    if (environment.mockApi) {
      effect(() => {
        console.log('refreshing wallet content', this.walletRefreshTrigger());
      });
      effect(() => {
        console.log('refreshing order content', this.orderRefreshTrigger());
      });
    }
    effect(() => {
      const _ = this.formChanges();
      if (this.orderForm.dirty) {
        this.orderStatus.set('');
      }
    });

    effect(() => {
      const selectedStock = this.selectedStockName();
      const stocks = this.stockNamesAndPrices();

      if (!selectedStock || stocks.length == 0) return;

      const stock = stocks.find((stock) => stock.stockName === selectedStock);
      if (stock) this.priceCtrl.setValue(stock.currentPrice.toString());
    });

    effect(() => {
      const price = Number(this.priceSignal());
      const amount = Number(this.amountSignal());

      if (!price || !amount) {
        this.totalCtrl.setValue('');
        return;
      } else {
        this.totalCtrl.setValue((price * amount).toFixed(2).toString());
      }
    });
  }

  ordersService = inject<IOrdersService>(ORDERS_SERVICE_TOKEN);
  marketDataService = inject<IMarketDataService>(MARKETDATA_SERVICE_TOKEN);
  walletService = inject<IWalletService>(WALLET_SERVICE_TOKEN);

  protected readonly orderStatus = signal<string>('');
  protected readonly walletRefreshTrigger = signal(0);
  protected readonly orderRefreshTrigger = signal(0);
  protected readonly paramPage = signal(1);
  protected readonly paramSize = signal(5);

  private wallet$: Observable<WalletSummaryDto> = toObservable(this.walletRefreshTrigger).pipe(
    switchMap(() => this.walletService.getWallet()),
    shareReplay(1)
  );

  protected readonly totalCash: Signal<number> = toSignal(
    this.wallet$.pipe(map((wallet) => wallet.totalCash)),
    { initialValue: 0 }
  );

  protected readonly holdings: Signal<HoldingSummaryDto[]> = toSignal(
    this.wallet$.pipe(map((wallet) => wallet.holdings)),
    {
      initialValue: [],
    }
  );

  private ordersInfo$: Observable<OrdersPaginatedDto> = toObservable(this.orderRefreshTrigger).pipe(
    switchMap(() => this.ordersService.getOrderHistory(this.paramPage(), this.paramSize())),
    shareReplay(1)
  );

  stockLastUpdate: Signal<StockUpdateDto> = toSignal(this.marketDataService.getLastUpdate(), {
    initialValue: { lastUpdate: '' },
  });

  stockNamesAndPrices: Signal<HoldingNamePriceDto[]> = toSignal(
    this.marketDataService.getStockDataWithUpdateCheck().pipe(
      map((stocks) => {
        if (!stocks) return [];
        return stocks.map(
          (stock) =>
            ({
              stockName: stock.stockName,
              currentPrice: stock.pricePerShare,
            } as HoldingNamePriceDto)
        );
      })
    ),
    { initialValue: [] }
  );

  orders: Signal<OrderDto[]> = toSignal(this.ordersInfo$.pipe(map((info) => info.orders)), {
    initialValue: [],
  });
  pageNumber: Signal<number> = toSignal(this.ordersInfo$.pipe(map((info) => info.pageNumber)), {
    initialValue: 1,
  });

  totalPages: Signal<number> = toSignal(this.ordersInfo$.pipe(map((info) => info.totalPages)), {
    initialValue: 1,
  });

  private readonly fb = inject(FormBuilder);
  protected readonly stocknameCtrl = this.fb.control('', [Validators.required]);
  protected readonly typeCtrl = this.fb.control('', [Validators.required]);
  protected readonly priceCtrl = this.fb.control({ value: '', disabled: true });
  protected readonly totalCtrl = this.fb.control({ value: '', disabled: true });
  protected readonly amountCtrl = this.fb.control('', [
    Validators.required,
    commaToDot,
    Validators.pattern(/^\d+([.,]\d+)?$/),
  ]);
  protected readonly orderForm = this.fb.group({
    stockname: this.stocknameCtrl,
    type: this.typeCtrl,
    price: this.priceCtrl,
    total: this.totalCtrl,
    amount: this.amountCtrl,
  });

  protected readonly selectedStockName = toSignal(this.stocknameCtrl.valueChanges, {
    initialValue: this.stocknameCtrl.value,
  });

  protected readonly formChanges = toSignal(this.orderForm.valueChanges, {
    initialValue: this.orderForm.value,
  });

  protected readonly priceSignal = toSignal(this.priceCtrl.valueChanges, {
    initialValue: this.priceCtrl.value,
  });
  protected readonly amountSignal = toSignal(this.amountCtrl.valueChanges, {
    initialValue: this.amountCtrl.value,
  });

  setPageNumber(pagenr: number) {
    this.paramPage.set(pagenr);
    this.orderRefreshTrigger.update((value) => value + 1);
  }

  protected readonly canSell: Signal<boolean> = computed(() => {
    const holdings = this.holdings();
    const selectedStock = this.selectedStockName();

    if (!selectedStock) return false;

    return holdings.some((holding) => holding.stockName === selectedStock && holding.amount > 0);
  });

  submitOrder(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    this.orderStatus.set('Connecting...');

    const orderPostDTO: OrderPostDto = {
      stockName: this.stocknameCtrl.value!.toString(),
      type: this.typeCtrl.value!.toString(),
      price: Number(this.priceCtrl.value),
      amount: Number(this.amountCtrl.value),
    };

    if (environment.mockApi) {
      console.log('mock submitOrder attempt', { orderPostDTO });
    }

    this.ordersService.postOrder(orderPostDTO).subscribe({
      next: () => {
        this.walletRefreshTrigger.update((value) => value + 1);
        this.orderRefreshTrigger.update((value) => value + 1);
        this.orderStatus.set('Successfully submitted new order.');
        this.orderForm.reset();
        this.priceCtrl.setValue('');
        this.totalCtrl.setValue('');
        this.typeCtrl.setValue('');
      },
      error: (err) => {
        this.orderStatus.set('Failed to submit new order.');
      },
    });
  }

  onBlurAmount() {
    const val = Number(this.amountCtrl.value?.toString().replace(',', '.')) || 0;
    this.amountCtrl.setValue(val.toFixed(2));
  }
}
