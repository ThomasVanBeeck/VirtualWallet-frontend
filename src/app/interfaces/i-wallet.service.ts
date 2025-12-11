import { Observable } from 'rxjs';
import { TransferDto } from '../DTOs/TransferDtos';
import { WalletSummaryDto } from '../DTOs/WalletDtos';

export interface IWalletService {
  getWallet(page?: number, size?: number): Observable<WalletSummaryDto>;
  postTransfer(transferDto: TransferDto): Observable<void>;
}
