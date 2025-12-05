export interface TransferDTO {
  amount: number;
  type: string;
}

export interface TransferSummaryDTO {
  amount: number;
  date: string;
  type: string;
}

export interface TransfersPaginatedDTO {
  transfers: TransferSummaryDTO[];
  pageNumber: number;
  totalPages: number;
}
