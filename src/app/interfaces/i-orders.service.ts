import { Observable } from 'rxjs';
import { OrderPostDto, OrdersPaginatedDto } from '../DTOs/OrderDtos';

export interface IOrdersService {
  getOrderHistory(page: number, size: number): Observable<OrdersPaginatedDto>;
  postOrder(orderPostDto: OrderPostDto): Observable<void>;
}
