import { HoldingDTO } from "./HoldingDTOs";
import { TransferDTO } from "./TransferDTOs";

export interface WalletDTO {
    Transfers: TransferDTO[],
    Holdings: HoldingDTO[]
}