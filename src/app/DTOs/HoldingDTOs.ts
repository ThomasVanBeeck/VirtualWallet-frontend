export interface HoldingNamePriceDto {
  stockName: string;
  currentPrice: number;
}

export interface HoldingSummaryDto {
  stockName: string;
  amount: number;
  currentPrice: number;
  totalValue: number;
  totalProfit: number;
  winLossPct: number;
}
