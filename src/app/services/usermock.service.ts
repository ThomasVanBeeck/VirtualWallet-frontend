import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { UserDto, UserRegisterDto } from '../DTOs/UserDtos';
import { AbstractUserService } from './abstractuser.service';
import { MockstateService } from './mockstate.service';

@Injectable({
  providedIn: 'root',
})
export class UsermockService extends AbstractUserService {
  private mockstateService = inject(MockstateService);

  public getCurrentUser(): Observable<UserDto> {
    console.log('mock getCurrentUser');
    if (this.mockstateService.isMockLoggedIn && this.mockstateService.currentMockUser) {
      return of(this.mockstateService.currentMockUser);
    }
    return throwError(() => new Error('Mock getCurrentUser failed.'));
  }

  public registerNewUser(userRegisterDto: UserRegisterDto): Observable<void> {
    console.log('Mock: registerNewUser called');

    const existingUser = this.mockstateService.mockNewUsers.find(
      (user) => user.Username === userRegisterDto.Username
    );

    if (existingUser) {
      console.error(`Mock: User '${userRegisterDto.Username}' already exists.`);
      return throwError(() => new Error('Mock: username already taken'));
    }

    this.mockstateService.mockNewUsers.push(userRegisterDto);
    console.log(`Mock: New User '${userRegisterDto.Username}' registered.`);
    return of(void 0);
  }

  usernameExists(username: string): Observable<boolean> {
    console.log('Mock: usernameExists called');

    const existingUser = this.mockstateService.mockNewUsers.some(
      (user) => user.Username === username
    );
    return of(existingUser);
  }
}
