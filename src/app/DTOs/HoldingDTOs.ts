import { OrderDTO } from "./OrderDTOs";

export interface HoldingDTO {
    StockName: string,
    Orders: OrderDTO[]
}

export interface HoldingSummaryDTO {
    StockName: string,
    Amount: number,
    AvgPrice: number,
    CurrentPrice: number,
    TotalValue: number,
    TotalProfit: number,
    WinLossPct: number
}