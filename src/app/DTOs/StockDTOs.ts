export interface StockDto {
  stockName: string;
  type: string;
  description: string;
  pricePerShare: number;
  changePct24Hr: number;
  pctOfWallet?: number;
  sharesAmount?: number;
  investmentAmount?: number;
}

export interface StockUpdateDto {
  lastUpdate: string;
}
