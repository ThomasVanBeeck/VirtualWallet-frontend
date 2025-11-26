import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserRegisterDTO, UserLoginDTO } from '../DTOs/UserDTOs';
import { SessionstorageService } from './sessionstorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  sessionstorage = inject(SessionstorageService);

  private apiUrl = environment.apiUrl;
  public isMockLoggedIn: boolean = false;

  public mockUser: UserRegisterDTO = {
    Username: 'ThomasVanBeeck',
    FirstName: 'Thomas',
    LastName: 'Van Beeck',
    Email: 'thomas@vanbeeck.be',
    Password: 'Test1234Test!',
  };

  public mockNewUsers: Array<UserRegisterDTO> = [this.mockUser];
  public currentMockUser: UserRegisterDTO | null = null;

  public login(userLoginDTO: UserLoginDTO): Observable<void> {
    if (environment.mockApi) {
      console.log('mock login');

      const loginUser = this.mockNewUsers.find(
        (user) =>
          user.Username === userLoginDTO.Username &&
          user.Password === userLoginDTO.Password
      );

      if (loginUser) {
        this.isMockLoggedIn = true;
        this.currentMockUser = loginUser;
        return of(void 0);
      }
      return throwError(() => new Error('Invalid mock credentials'));
    } else
      return this.http.post<void>(`${this.apiUrl}/auth/login`, userLoginDTO, {
        withCredentials: true,
      });
  }

  public logout(): Observable<void> {
    if (environment.mockApi) {
      console.log('mock logout');
      this.isMockLoggedIn = false;
      this.currentMockUser = null;
      this.sessionstorage.clearAllItems();
      return of(void 0);
    } else {
      this.sessionstorage.clearAllItems();
      return this.http
        .post<void>(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true })
        .pipe(
          catchError((err) => {
            console.error('Logout API error');
            return throwError(() => err);
          })
        );
    }
  }
}
