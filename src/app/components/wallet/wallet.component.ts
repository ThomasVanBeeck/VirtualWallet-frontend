import { Component, effect, inject, signal, Signal } from '@angular/core';
import { TransferDTO, TransferSummaryDTO } from '../../DTOs/TransferDTOs';
import { WalletService } from '../../services/wallet.service';
import { map, Observable, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { HoldingSummaryDTO } from '../../DTOs/HoldingDTOs';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { WalletSummaryDTO, WalletTotalDTO } from '../../DTOs/WalletDTOs';

@Component({
  selector: 'app-wallet',
  imports: [DecimalPipe, ReactiveFormsModule],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css',
})
export class WalletComponent {

  constructor() {
    if (environment.mockApi) {
      effect(() => {
        console.log("refreshing wallet content", this.refreshTrigger())
      })

    }
  }

  protected readonly walletService = inject(WalletService)
  protected readonly transferStatus = signal<string>('')
  protected readonly transferTypes = signal<string[]>(["Deposit", "Withdrawal"])
  private readonly refreshTrigger = signal(0)
  private wallet$: Observable<WalletSummaryDTO> = toObservable(this.refreshTrigger).pipe(
    switchMap(() => this.walletService.getWallet())
  )

  transfers: Signal<TransferSummaryDTO[] | undefined> = toSignal(
    this.wallet$.pipe(
      map(wallet => wallet.Transfers),
    ),
  )

  holdings: Signal<HoldingSummaryDTO[] | undefined> = toSignal(
    this.wallet$.pipe(
      map(wallet => wallet.Holdings)
    ),
  )

  walletTotals: Signal<WalletTotalDTO | undefined> = toSignal(
    this.wallet$.pipe(
      map(walletSummary => ({
        TotalCash: walletSummary.TotalCash,
        TotalValue: walletSummary.TotalValue,
        TotalProfit: walletSummary.TotalProfit,
        WinLossPct: walletSummary.WinLossPct
      }))
    ),
    {
      initialValue: {
        TotalCash: 0,
        TotalValue: 0,
        TotalProfit: 0,
        WinLossPct: 0
      } as WalletTotalDTO
    }
  )

  private readonly fb = inject(FormBuilder)
  protected readonly amountCtrl = this.fb.control('', [Validators.required])
  protected readonly typeCtrl = this.fb.control('', [Validators.required])
  protected readonly transferForm = this.fb.group({
    amount: this.amountCtrl,
    type: this.typeCtrl
  })

  transfer(): void {
    if (this.transferForm.invalid) {
      this.transferForm.markAllAsTouched();
      return;
    }

    this.transferStatus.set("Connecting...")

    const transferDTO: TransferDTO = {
      Amount: Number(this.amountCtrl.value),
      Type: this.typeCtrl.value!.toString()
    }

    if (environment.mockApi) {
      console.log("mock transfer attempt", { transferDTO })
    }

    this.walletService.postTransfer(transferDTO).subscribe({
      next: () => {
        // add way to refresh the whole wallet
        this.refreshTrigger.update(value => value +1)
        this.transferStatus.set("Successfully transferred.")
      },
      error: err => {
        this.transferStatus.set("Failed to transfer.")
      }
    })
  }
}