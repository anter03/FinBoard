import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Instrument } from '../models/Instrument'; // Assicurati che esista questo model

@Injectable({
  providedIn: 'root',
})
export class InstrumentService {
  private apiUrl = 'http://localhost:8080/api/instruments';

  constructor(private http: HttpClient) {}

  // GET tutti gli strumenti
  getAll(): Observable<Instrument[]> {
    return this.http.get<Instrument[]>(this.apiUrl);
  }

  // GET strumento per ID
  getById(id: number): Observable<Instrument> {
    return this.http.get<Instrument>(`${this.apiUrl}/${id}`);
  }

  // POST nuovo strumento
  createInstrument(instrument: Instrument): Observable<Instrument> {
    return this.http.post<Instrument>(this.apiUrl, instrument);
  }

  // PUT modifica strumento
  updateInstrument(id: number, instrument: Instrument): Observable<Instrument> {
    return this.http.put<Instrument>(`${this.apiUrl}/${id}`, instrument);
  }

  // DELETE strumento
  deleteInstrument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
