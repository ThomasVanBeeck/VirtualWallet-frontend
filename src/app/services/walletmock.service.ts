import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { TransferDto, TransfersPaginatedDto, TransferSummaryDto } from '../DTOs/TransferDtos';
import { WalletSummaryDto } from '../DTOs/WalletDtos';
import { IWalletService } from '../interfaces/i-wallet.service';
import { MockstateService } from './mockstate.service';

@Injectable({
  providedIn: 'root',
})
export class WalletmockService implements IWalletService {
  constructor() {}

  private mockstateService = inject(MockstateService);

  public getWallet(page: number = 1, size: number = 5): Observable<WalletSummaryDto> {
    console.log('mock getWallet');
    if (this.mockstateService.isMockLoggedIn) {
      const startIndex = (page - 1) * size;
      const totalItems = this.mockstateService.mockTransferList.length;
      const totalPages: number = Math.ceil(totalItems / size);

      let transfers: TransferSummaryDto[];

      if (startIndex >= totalItems) {
        transfers = [];
      } else
        transfers = this.mockstateService.mockTransferList.slice(startIndex, startIndex + size);

      const transfersPaginatedDTO: TransfersPaginatedDto = {
        transfers: transfers,
        pageNumber: page,
        totalPages: totalPages,
      };
      this.mockstateService.mockWallet.transferPage = transfersPaginatedDTO;

      return of(this.mockstateService.mockWallet);
    }
    return throwError(() => new Error('Unauthorized, not mock logged in.'));
  }

  public postTransfer(transferDto: TransferDto): Observable<void> {
    console.log('mock postTransfer');
    if (this.mockstateService.isMockLoggedIn) {
      const newTransfer: TransferSummaryDto = {
        amount: transferDto.amount,
        date: `1999-01-01T01:00:00Z`,
        type: transferDto.type,
      };

      if (
        newTransfer.type === 'Withdrawal' &&
        newTransfer.amount > this.mockstateService.mockWallet.totalCash
      )
        return throwError(() => new Error('insufficient mock funds.'));

      if (newTransfer.type === 'Withdrawal')
        this.mockstateService.mockWallet.totalCash -= newTransfer.amount;
      else this.mockstateService.mockWallet.totalCash += newTransfer.amount;

      this.mockstateService.mockTransferList.unshift(newTransfer);
      return of(void 0);
    }
    return throwError(() => new Error('Mock transfer failed.'));
  }
}
