export interface HoldingNamePriceDTO {
  stockName: string;
  currentPrice: number;
}

export interface HoldingSummaryDTO {
  stockName: string;
  amount: number;
  currentPrice: number;
  totalValue: number;
  totalProfit: number;
  winLossPct: number;
}
