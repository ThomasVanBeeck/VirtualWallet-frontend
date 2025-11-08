import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment'
import { UserModel } from '../models/usermodel';


@Injectable({
  providedIn: 'root'
})
  
export class AuthService {
  http = inject(HttpClient)

  private apiUrl = environment.apiUrl
  isMockLoggedIn: boolean = true

  private mockUser: UserModel = {
    username: 'Thomas Van Beeck',
    password: 'Test1234Test!'
  }

  public login(username: string, password: string): Observable<void> {
    if (environment.mockApi) {
      console.log("mock login")
      if (username === this.mockUser.username && password === this.mockUser.password) {
        this.isMockLoggedIn = true        
        return of(undefined)
      }
      return throwError(() => ({
        status: 401,
        message: 'Invalid mock credentials'
      }));
    }
    else
      return this.http.post<void>(`${this.apiUrl}/auth/login`,
        { username, password },
        { withCredentials: true }
      )
  }

  public logout(): Observable<void> {
    if (environment.mockApi) {
      console.log("mock logout")
      this.isMockLoggedIn = false
      return of (undefined)
    }
    else
      return this.http.post<void>(`${this.apiUrl}/auth/logout`,
        {},
        { withCredentials: true }
      )
  }

  public getCurrentUser(): Observable<UserModel> {
    if (environment.mockApi) {
      console.log("mock getCurrentUser");
      if (this.isMockLoggedIn) {
        return of(this.mockUser);
      }
      return throwError(() => ({ status: 401 }))
    }

    return this.http.get<UserModel>(
      `${this.apiUrl}/user/current-user`,
      { withCredentials: true }
    );
  }

    public getTestUser(): Observable<UserModel> {
    if (environment.mockApi) {
      console.log("mock getTestUser");
      if (this.isMockLoggedIn) {
        return of(this.mockUser);
      }
      return throwError(() => ({ status: 401 }))
    }

    return this.http.get<UserModel>(
      `${this.apiUrl}/user/testuser`,
      { withCredentials: true }
    );
  }
}