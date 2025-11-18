import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment'
import { UserRegisterDTO, UserLoginDTO } from '../DTOs/UserDTOs';
import { SessionstorageService } from './sessionstorage.service';


@Injectable({
  providedIn: 'root'
})
  
export class AuthService {
  http = inject(HttpClient)
  sessionstorage = inject(SessionstorageService)

  private apiUrl = environment.apiUrl
  public isMockLoggedIn: boolean = false

  public mockUser: UserRegisterDTO = {
    Username: 'ThomasVanBeeck',
    FirstName: 'Thomas',
    LastName: 'Van Beeck',
    Email: 'thomas@vanbeeck.be',
    Password: 'Test1234Test!'
  }

  public mockNewUsers: Array<UserRegisterDTO> = [this.mockUser]
  public currentMockUser: UserRegisterDTO | null = null

  public login(userLoginDTO: UserLoginDTO): Observable<void> {
    if (environment.mockApi) {
      console.log("mock login")

      const loginUser = this.mockNewUsers.find(
        user => user.Username === userLoginDTO.Username &&
      user.Password === userLoginDTO.Password)

      if (loginUser) {
        this.isMockLoggedIn = true  
        this.currentMockUser = loginUser
        return of(undefined)
      }
      return throwError(() => ({
        status: 401,
        message: 'Invalid mock credentials'
      }));
    }
    else
      return this.http.post<void>(`${this.apiUrl}/auth/login`,
        userLoginDTO,
        { withCredentials: true }
      )
  }

  public logout(): Observable<void> {
    if (environment.mockApi) {
      console.log("mock logout")
      this.isMockLoggedIn = false
      this.currentMockUser = null
      this.sessionstorage.clearAllItems()
      return of (undefined)
    }
    else {
      this.sessionstorage.clearAllItems()
      return this.http.post<void>(`${this.apiUrl}/auth/logout`,
        {},
        { withCredentials: true }
      )
    }
  }

  public getCurrentUser(): Observable<UserRegisterDTO> {
    if (environment.mockApi) {
      console.log("mock getCurrentUser");
      if (this.isMockLoggedIn && this.currentMockUser) {
        return of(this.currentMockUser);
      }
      return throwError(() => ({ status: 401 }))
    }

    return this.http.get<UserRegisterDTO>(
      `${this.apiUrl}/user/current-user`,
      { withCredentials: true }
    );
  }
}