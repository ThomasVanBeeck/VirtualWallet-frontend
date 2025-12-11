import { Observable } from 'rxjs';
import { UserLoginDto } from '../DTOs/UserDtos';

export interface IAuthService {
  login(userLoginDTO: UserLoginDto): Observable<void>;
  logout(): Observable<void>;
}
