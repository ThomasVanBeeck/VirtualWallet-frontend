import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { UserLoginDto } from '../DTOs/UserDtos';
import { IAuthService } from '../interfaces/i-auth.service';
import { MockstateService } from './mockstate.service';
import { SessionstorageService } from './sessionstorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthmockService implements IAuthService {
  private sessionstorage = inject(SessionstorageService);
  private mockstateService = inject(MockstateService);

  public login(userLoginDto: UserLoginDto): Observable<void> {
    console.log('mock login');

    const loginUser = this.mockstateService.mockNewUsers.find(
      (user) => user.Username === userLoginDto.Username && user.Password === userLoginDto.Password
    );

    if (loginUser) {
      this.mockstateService.isMockLoggedIn = true;
      this.mockstateService.currentMockUser = loginUser;
      return of(void 0);
    }
    return throwError(() => new Error('Invalid mock credentials'));
  }

  public logout(): Observable<void> {
    console.log('mock logout');

    this.mockstateService.isMockLoggedIn = false;
    this.mockstateService.currentMockUser = null;
    this.sessionstorage.clearAllItems();
    return of(void 0);
  }
}
