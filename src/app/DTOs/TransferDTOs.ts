export interface TransferDTO {
    Amount: number,
    Type: string
}

export interface TransferSummaryDTO {
    Amount: number,
    Date: string,
    Type: string
}

export interface TransfersPaginatedDTO {
    Transfers: TransferSummaryDTO[];
    PageNumber: number;
    TotalPages: number;
}