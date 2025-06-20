import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InstrumentType } from '../models/Instument-type';

@Injectable({
  providedIn: 'root',
})
export class InstrumentTypeService {
  private apiUrl = 'http://localhost:8080/api/instrument-types';

  constructor(private http: HttpClient) {}

  // GET tutti i tipi di strumenti
  getAllInstrumentTypes(): Observable<InstrumentType[]> {
    return this.http.get<InstrumentType[]>(this.apiUrl);
  }
}
