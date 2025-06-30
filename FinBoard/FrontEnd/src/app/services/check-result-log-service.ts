import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckResultLog } from '../models/check-result-log';

@Injectable({
  providedIn: 'root'
})
export class CheckResultLogService {

  private readonly baseUrl = 'http://localhost:8080/api/check-result-logs'; 
  constructor(private http: HttpClient) {}

  /**
   * Recupera tutti i log
   */
  getAllLogs(): Observable<CheckResultLog[]> {
    return this.http.get<CheckResultLog[]>(this.baseUrl);
  }

  /**
   * Recupera un log specifico per ID
   */
  getLogById(id: number): Observable<CheckResultLog> {
    return this.http.get<CheckResultLog>(`${this.baseUrl}/${id}`);
  }
}
