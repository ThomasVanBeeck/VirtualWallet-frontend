export interface OrderDTO {
  StockName: string;
  OrderDate: string;
  Type: string;
  Price: number;
  Amount: number;
  Total: number;
}

export interface OrdersPaginatedDTO {
  Orders: OrderDTO[];
  PageNumber: number;
  TotalPages: number;
}

export interface OrderPostDTO {
  StockName: string;
  Type: string;
  Price: number;
  Amount: number;
}
