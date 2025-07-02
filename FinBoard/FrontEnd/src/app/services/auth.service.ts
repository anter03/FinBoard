import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/login-request';
import { AuthResponse } from '../models/auth-response';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }
//
//
//login(credentials: LoginRequest): Observable<AuthResponse> {
//  return this.http.post(`${this.baseUrl}/login`, credentials);
//}



login(credentials: LoginRequest): Observable<AuthResponse> {
  console.log(credentials);
  return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials)
    .pipe(
      tap(response => {
        sessionStorage.setItem('token', response.token);
          sessionStorage.setItem('user', JSON.stringify(response.user));

      })
    );
}


}