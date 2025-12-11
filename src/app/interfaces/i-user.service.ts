import { AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserDto, UserRegisterDto } from '../DTOs/UserDtos';

export interface IUserService {
  getCurrentUser(): Observable<UserDto>;
  registerNewUser(userRegistDto: UserRegisterDto): Observable<void>;
  usernameExists(username: string): Observable<boolean>;
  validateUsername(): AsyncValidatorFn;
}
