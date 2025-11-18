import { Component, inject, OnInit, Signal } from '@angular/core';
import { TransferDTO } from '../../DTOs/TransferDTOs';
import { WalletService } from '../../services/wallet.service';
import { Observable } from 'rxjs';
import { WalletDTO } from '../../DTOs/WalletDTOs';

@Component({
  selector: 'app-wallet',
  imports: [],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css',
})
export class WalletComponent implements OnInit {
  walletService = inject(WalletService)

  wallet!: Signal<TransferDTO[]> 
  walletObs$: Observable<WalletDTO> | null = null


  ngOnInit(): void {
    this.fetchWallet()
  }
  
  fetchWallet(): void {
    this.walletObs$ = this.walletService.getWallet()
  }

}
