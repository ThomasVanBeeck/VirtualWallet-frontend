import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserLoginDto } from '../DTOs/UserDtos';
import { IAuthService } from '../interfaces/i-auth.service';
import { SessionstorageService } from './sessionstorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements IAuthService {
  private http = inject(HttpClient);
  private sessionstorage = inject(SessionstorageService);

  private apiUrl = environment.apiUrl;

  public login(userLoginDto: UserLoginDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/login`, userLoginDto, {
      withCredentials: true,
    });
  }

  public logout(): Observable<void> {
    this.sessionstorage.clearAllItems();
    return this.http.post<void>(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true }).pipe(
      catchError((err) => {
        console.error('Logout API error');
        return throwError(() => err);
      })
    );
  }
}
