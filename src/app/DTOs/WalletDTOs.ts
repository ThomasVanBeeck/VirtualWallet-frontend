import { HoldingSummaryDto } from './HoldingDtos';
import { TransfersPaginatedDto } from './TransferDtos';

export interface WalletSummaryDto {
  transferPage: TransfersPaginatedDto;
  holdings: HoldingSummaryDto[];
  totalCash: number;
  totalInStocks: number;
  totalProfit: number;
  winLossPct: number;
}

export interface WalletTotalDto {
  TotalCash: number;
  TotalValue: number;
  TotalProfit: number;
  WinLossPct: number;
}
