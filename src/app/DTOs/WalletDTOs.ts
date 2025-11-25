import { HoldingSummaryDTO } from "./HoldingDTOs";
import { TransfersPaginatedDTO, TransferSummaryDTO } from "./TransferDTOs";

export interface WalletSummaryDTO {
    TransferPage: TransfersPaginatedDTO,
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