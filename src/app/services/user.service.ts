import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserRegisterDto as UserDto, UserRegisterDto } from '../DTOs/UserDtos';
import { AbstractUserService } from './abstractuser.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends AbstractUserService {
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  public getCurrentUser(): Observable<UserDto> {
    return this.http
      .get<UserDto>(`${this.apiUrl}/user/current-user`, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          console.error('getCurrentUser API error:', err);
          return throwError(() => err);
        })
      );
  }

  public registerNewUser(userRegisterDto: UserRegisterDto): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/user/create-user`, userRegisterDto, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          console.error('registerNewUser API error:', err);
          return throwError(() => err);
        })
      );
  }

  usernameExists(username: string): Observable<boolean> {
    return this.http
      .get<boolean>(`${this.apiUrl}/user/exists/${username}`, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          console.error('usernameExists API error:', err);
          return of(false);
        })
      );
  }
}
