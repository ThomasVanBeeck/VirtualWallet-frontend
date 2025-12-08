export interface OrderDTO {
  stockName: string;
  date: string;
  type: string;
  price: number;
  amount: number;
  total: number;
}

export interface OrdersPaginatedDTO {
  orders: OrderDTO[];
  pageNumber: number;
  totalPages: number;
}

export interface OrderPostDTO {
  stockName: string;
  type: string;
  price: number;
  amount: number;
}
