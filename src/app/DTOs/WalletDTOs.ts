import { HoldingSummaryDTO } from './HoldingDTOs';
import { TransfersPaginatedDTO, TransferSummaryDTO } from './TransferDTOs';

export interface WalletSummaryDTO {
  transferPage: TransfersPaginatedDTO;
  holdings: HoldingSummaryDTO[];
  totalCash: number;
  totalInStocks: number;
  totalProfit: number;
  winLossPct: number;
}

export interface WalletTotalDTO {
  TotalCash: number;
  TotalValue: number;
  TotalProfit: number;
  WinLossPct: number;
}
