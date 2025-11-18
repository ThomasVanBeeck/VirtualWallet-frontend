export interface StockModel {
    stockName: string;
    type: string;
    description: string;
    pricePerShare: number;
    changePct24Hr: number;
    pctOfWallet?: number;
    sharesAmount?: number;
    investmentAmount?: number;
}