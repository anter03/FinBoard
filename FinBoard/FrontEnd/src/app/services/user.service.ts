import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  // GET tutti gli utenti
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // GET utente per ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // POST nuovo utente
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // PUT modifica utente
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // DELETE soft delete
  softDeleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/soft/${id}`);
  }

  // DELETE hard delete
  hardDeleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/hard/${id}`);
  }
}
