export interface StockModel {
    stockname: string;
    type: string;
    price_per_share: number;
    change_pct_24hr: number;
    pct_of_wallet: number;
    shares_amount: number;
    investment_amount: number;
}