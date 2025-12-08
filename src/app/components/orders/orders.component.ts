import {
  Component,
  computed,
  effect,
  inject,
  Signal,
  signal,
} from '@angular/core';
import { environment } from '../../../environments/environment';
import { OrdersService } from '../../services/orders.service';
import { map, Observable, switchMap, tap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  OrderDTO,
  OrderPostDTO,
  OrdersPaginatedDTO,
} from '../../DTOs/OrderDTOs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MarketDataService } from '../../services/market-data.service';
import { commaToDot } from '../../validators/commatodot.validator';
import { HoldingNamePriceDTO, HoldingSummaryDTO } from '../../DTOs/HoldingDTOs';
import { WalletService } from '../../services/wallet.service';
import { WalletSummaryDTO } from '../../DTOs/WalletDTOs';

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
        console.log('refreshing order content', this.refreshTrigger());
      });
      effect(() => {
        const _ = this.formChanges();
        if (this.orderForm.dirty) {
          this.orderStatus.set('');
        }
      });
    }

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

  protected readonly ordersService = inject(OrdersService);
  protected readonly marketDataService = inject(MarketDataService);
  protected readonly walletService = inject(WalletService);

  protected readonly orderStatus = signal<string>('');
  protected readonly refreshTrigger = signal(0);
  protected readonly paramPage = signal(1);
  protected readonly paramSize = signal(5);

  private wallet$: Observable<WalletSummaryDTO> = toObservable(
    this.refreshTrigger
  ).pipe(
    tap(() => this.walletService.emptyWalletCache()),
    switchMap(() =>
      this.walletService.getWallet(this.paramPage(), this.paramSize())
    )
  );

  protected readonly totalCash: Signal<number> = toSignal(
    this.wallet$.pipe(map((wallet) => wallet.totalCash)),
    { initialValue: 0 }
  );

  protected readonly holdings: Signal<HoldingSummaryDTO[]> = toSignal(
    this.wallet$.pipe(map((wallet) => wallet.holdings)),
    {
      initialValue: [],
    }
  );

  private ordersInfo$: Observable<OrdersPaginatedDTO> = toObservable(
    this.refreshTrigger
  ).pipe(
    switchMap(() =>
      this.ordersService.getOrderHistory(this.paramPage(), this.paramSize())
    )
  );

  stockNamesAndPrices: Signal<HoldingNamePriceDTO[]> = toSignal(
    this.marketDataService.getStockData().pipe(
      map((stocks) => {
        if (!stocks) return [];
        return stocks.map(
          (stock) =>
            ({
              stockName: stock.stockName,
              currentPrice: stock.pricePerShare,
            } as HoldingNamePriceDTO)
        );
      })
    ),
    { initialValue: [] }
  );

  orders: Signal<OrderDTO[]> = toSignal(
    this.ordersInfo$.pipe(map((info) => info.orders)),
    { initialValue: [] }
  );
  pageNumber: Signal<number> = toSignal(
    this.ordersInfo$.pipe(map((info) => info.pageNumber)),
    { initialValue: 1 }
  );

  totalPages: Signal<number> = toSignal(
    this.ordersInfo$.pipe(map((info) => info.totalPages)),
    { initialValue: 1 }
  );

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

  protected readonly selectedStockName = toSignal(
    this.stocknameCtrl.valueChanges,
    {
      initialValue: this.stocknameCtrl.value,
    }
  );

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
    this.refreshTrigger.update((value) => value + 1);
  }

  protected readonly canSell: Signal<boolean> = computed(() => {
    const holdings = this.holdings();
    const selectedStock = this.selectedStockName();

    if (!selectedStock) return false;

    return holdings.some(
      (holding) => holding.stockName === selectedStock && holding.amount > 0
    );
  });

  submitOrder(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    this.orderStatus.set('Connecting...');

    const orderPostDTO: OrderPostDTO = {
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
        this.refreshTrigger.update((value) => value + 1);
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
    const val =
      Number(this.amountCtrl.value?.toString().replace(',', '.')) || 0;
    this.amountCtrl.setValue(val.toFixed(2));
  }
}
