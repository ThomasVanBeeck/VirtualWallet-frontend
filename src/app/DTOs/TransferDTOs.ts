export interface TransferDto {
  amount: number;
  type: string;
}

export interface TransferSummaryDto {
  amount: number;
  date: string;
  type: string;
}

export interface TransfersPaginatedDto {
  transfers: TransferSummaryDto[];
  pageNumber: number;
  totalPages: number;
}
