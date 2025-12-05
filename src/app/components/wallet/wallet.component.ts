import { Component, effect, inject, signal, Signal } from '@angular/core';
import { TransferDTO, TransferSummaryDTO } from '../../DTOs/TransferDTOs';
import { WalletService } from '../../services/wallet.service';
import { map, Observable, switchMap, tap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { HoldingSummaryDTO } from '../../DTOs/HoldingDTOs';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { WalletSummaryDTO, WalletTotalDTO } from '../../DTOs/WalletDTOs';
import { commaToDot } from '../../validators/commatodot.validator';

@Component({
  selector: 'app-wallet',
  imports: [DecimalPipe, ReactiveFormsModule, DatePipe],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css',
})
export class WalletComponent {
  constructor() {
    {
      effect(() => {
        const nothing = this.refreshTrigger();
        if (environment.mockApi) console.log('refreshing wallet content');
      });
    }
    effect(() => {
      const nothing = this.formChanges();
      if (this.transferForm.dirty) {
        this.transferStatus.set('');
      }
    });
    effect(() => {
      const nothing = this.walletTotals();
      if (this.walletTotals().TotalCash <= 0)
        this.transferTypes.set(['Deposit']);
      else this.transferTypes.set(['Deposit', 'Withdrawal']);
    });
  }

  protected readonly walletService = inject(WalletService);
  protected readonly transferStatus = signal<string>('');
  protected readonly transferTypes = signal<string[]>([
    'Deposit',
    'Withdrawal',
  ]);
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

  transfers: Signal<TransferSummaryDTO[]> = toSignal(
    this.wallet$.pipe(map((wallet) => wallet.transferPage.transfers)),
    { initialValue: [] }
  );

  holdings: Signal<HoldingSummaryDTO[]> = toSignal(
    this.wallet$.pipe(map((wallet) => wallet.holdings)),
    { initialValue: [] }
  );

  pageNumber: Signal<number> = toSignal(
    this.wallet$.pipe(map((wallet) => wallet.transferPage.pageNumber)),
    { initialValue: 1 }
  );

  totalPages: Signal<number> = toSignal(
    this.wallet$.pipe(map((wallet) => wallet.transferPage.totalPages)),
    { initialValue: 1 }
  );

  walletTotals: Signal<WalletTotalDTO> = toSignal(
    this.wallet$.pipe(
      map((walletSummary) => ({
        TotalCash: walletSummary.totalCash,
        TotalValue: walletSummary.totalInStocks,
        TotalProfit: walletSummary.totalProfit,
        WinLossPct: walletSummary.winLossPct,
      }))
    ),
    {
      initialValue: {
        TotalCash: 0,
        TotalValue: 0,
        TotalProfit: 0,
        WinLossPct: 0,
      } as WalletTotalDTO,
    }
  );

  private readonly fb = inject(FormBuilder);
  protected readonly amountCtrl = this.fb.control('', [
    Validators.required,
    commaToDot,
    Validators.pattern(/^\d+([.,]\d+)?$/),
  ]);
  protected readonly typeCtrl = this.fb.control('', [Validators.required]);
  protected readonly transferForm = this.fb.group({
    amount: this.amountCtrl,
    type: this.typeCtrl,
  });

  protected readonly formChanges = toSignal(this.transferForm.valueChanges, {
    initialValue: this.transferForm.value,
  });

  setPageNumber(pagenr: number) {
    this.paramPage.set(pagenr);
    this.refreshTrigger.update((value) => value + 1);
  }

  transfer(): void {
    if (this.transferForm.invalid) {
      this.transferForm.markAllAsTouched();
      return;
    }

    this.transferStatus.set('Connecting...');

    const transferDTO: TransferDTO = {
      amount: Number(this.amountCtrl.value),
      type: this.typeCtrl.value!.toString(),
    };

    if (environment.mockApi) {
      console.log('mock transfer attempt', { transferDTO });
    }

    this.walletService.postTransfer(transferDTO).subscribe({
      next: () => {
        this.refreshTrigger.update((value) => value + 1);
        this.transferStatus.set('Successfully transferred.');
        this.transferForm.reset();
      },
      error: (err) => {
        this.transferStatus.set('Failed to transfer.');
      },
    });
  }

  onBlurAmount() {
    const val =
      Number(this.amountCtrl.value?.toString().replace(',', '.')) || 0;
    this.amountCtrl.setValue(val.toFixed(2));
  }
}
