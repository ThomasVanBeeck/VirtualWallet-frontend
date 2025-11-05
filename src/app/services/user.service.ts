import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment'

export interface UserData {
  username: string;
}

@Injectable({
  providedIn: 'root'
})
  
export class UserService {


  private apiUrl = environment.apiUrl;

  private mockUserData: UserData = {
    username: 'Thomas Van Beeck'
  }

  constructor(private http: HttpClient) { }

  public getUserData(): Observable<UserData> {
    if (environment.mockApi) {
      console.log("mocking getUserData");
      return of(this.mockUserData);
    }
    else
      return this.http.get<UserData>(this.apiUrl + '/default-user');
  }
}