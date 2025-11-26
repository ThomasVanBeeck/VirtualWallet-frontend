import { Component, effect, inject, Signal, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { OrdersService } from '../../services/orders.service';
import { map, Observable, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  OrderDTO,
  OrderPostDTO,
  OrdersPaginatedDTO,
} from '../../DTOs/OrderDTOs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { MarketDataService } from '../../services/market-data.service';
import { commaToDot } from '../../validators/commatodot.validator';
import { HoldingNamePriceDTO } from '../../DTOs/HoldingDTOs';

@Component({
  selector: 'app-orders',
  imports: [DecimalPipe, ReactiveFormsModule],
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

      const stock = stocks.find((stock) => stock.StockName === selectedStock);
      if (stock) this.priceCtrl.setValue(stock.CurrentPrice.toString());
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

  protected readonly orderStatus = signal<string>('');
  protected readonly orderTypes = signal<string[]>(['Buy', 'Sell']);
  protected readonly refreshTrigger = signal(0);
  protected readonly paramPage = signal(1);
  protected readonly paramSize = signal(5);

  // TIJDELIJK
  protected readonly availableCash = signal(123456);

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
              StockName: stock.stockName,
              CurrentPrice: stock.pricePerShare,
            } as HoldingNamePriceDTO)
        );
      })
    ),
    { initialValue: [] }
  );

  orders: Signal<OrderDTO[] | undefined> = toSignal(
    this.ordersInfo$.pipe(map((info) => info.Orders))
  );
  pageNumber: Signal<number | undefined> = toSignal(
    this.ordersInfo$.pipe(map((info) => info.PageNumber))
  );

  totalPages: Signal<number | undefined> = toSignal(
    this.ordersInfo$.pipe(map((info) => info.TotalPages))
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

  submitOrder(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    this.orderStatus.set('Connecting...');

    const orderPostDTO: OrderPostDTO = {
      StockName: this.stocknameCtrl.value!.toString(),
      Type: this.typeCtrl.value!.toString(),
      Price: Number(this.priceCtrl.value),
      Amount: Number(this.amountCtrl.value),
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
