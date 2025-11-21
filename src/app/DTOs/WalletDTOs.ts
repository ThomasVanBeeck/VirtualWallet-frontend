import { HoldingSummaryDTO } from "./HoldingDTOs";
import { TransferSummaryDTO } from "./TransferDTOs";

export interface WalletSummaryDTO {
    Transfers: TransferSummaryDTO[],
    Holdings: HoldingSummaryDTO[]
    TotalCash: number,
    TotalValue: number,
    TotalProfit: number,
    WinLossPct: number
}

export interface WalletTotalDTO {
    TotalCash: number,
    TotalValue: number,
    TotalProfit: number,
    WinLossPct: number    
}
