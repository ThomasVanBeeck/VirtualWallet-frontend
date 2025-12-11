import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';
import { UserDto, UserRegisterDto } from '../DTOs/UserDtos';
import { IUserService } from '../interfaces/i-user.service';

@Injectable({
  providedIn: 'root',
})
export abstract class AbstractUserService implements IUserService {
  abstract getCurrentUser(): Observable<UserDto>;
  abstract registerNewUser(userRegistDto: UserRegisterDto): Observable<void>;
  abstract usernameExists(username: string): Observable<boolean>;

  public validateUsername(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return this.usernameExists(control.value).pipe(
        map((exists) => (exists ? { usernameTaken: true } : null)),
        catchError(() => of(null))
      );
    };
  }
}
