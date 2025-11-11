import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { UserRegisterDTO as UserDTO, UserRegisterDTO } from '../DTOs/UserDTOs';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  http = inject(HttpClient)
  authService = inject(AuthService)
  
  private apiUrl = environment.apiUrl

  public getCurrentUser(): Observable<UserDTO> {
    if (environment.mockApi) {
      console.log("mock getCurrentUser")
      if (this.authService.isMockLoggedIn && this.authService.currentMockUser) {
        return of(this.authService.currentMockUser)
      }
      return throwError(() => ({ status: 401 }))
    }
  
    return this.http.get<UserDTO>(
      `${this.apiUrl}/user/current-user`,
      { withCredentials: true }
    );
  }

  public registerNewUser(userRegisterDTO: UserRegisterDTO): Observable<void> { 
    
    if (environment.mockApi) {
      console.log("Mock: registerNewUser called")
      
      const existingUser = this.authService.mockNewUsers.find(
        user => user.username === userRegisterDTO.username
      );

      if (existingUser) {
        console.error(`Mock: User '${userRegisterDTO.username}' already exists.`)
        return throwError(() => ({ 
          status: 409, 
          error: "Username already taken" 
        }))
      }

      this.authService.mockNewUsers.push(userRegisterDTO);
      console.log(`Mock: New User '${userRegisterDTO.username}' registered.`)
      return of(undefined)
    }
    
    return this.http.post<void>(
      `${this.apiUrl}/user/create-user`,
      userRegisterDTO,
      { withCredentials: true }
    )
  }

  usernameExists(username: string): Observable<boolean>  {
    if (environment.mockApi) {
      console.log("Mock: usernameExists called")
      
      const existingUser = this.authService.mockNewUsers.some(
        user => user.username === username);
      return of (existingUser)
    }

    return this.http.get<boolean>(`${this.apiUrl}/user/exists/${username}`,
      { withCredentials: true }
    )
  }

  public validateUsername(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return this.usernameExists(control.value).pipe(
        map(exists => (exists ? { usernameTaken: true } : null)),
        catchError(() => of(null))
      )
    }
  }
}
