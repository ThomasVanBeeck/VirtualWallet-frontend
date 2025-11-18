import { OrderDTO } from "./OrderDTOs";

export interface HoldingDTO {
    StockName: string,
    Orders: OrderDTO[]
}