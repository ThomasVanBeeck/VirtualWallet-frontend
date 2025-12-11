export interface OrderDto {
  stockName: string;
  date: string;
  type: string;
  price: number;
  amount: number;
  total: number;
}

export interface OrdersPaginatedDto {
  orders: OrderDto[];
  pageNumber: number;
  totalPages: number;
}

export interface OrderPostDto {
  stockName: string;
  type: string;
  price: number;
  amount: number;
}
