import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/Order';
import { OrderFilters } from '../models/order-filters';
import { OrderValidationResponse } from '../models/OrderValidationResponse';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  // GET tutti gli ordini
  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  // GET ordine per ID
  getById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  // POST nuovo ordine
    //createOrder(order: Order): Observable<Order> {
    //  return this.http.post<Order>(this.apiUrl, order);
    //}
  createOrder(orderData: Order): Observable<OrderValidationResponse> {
  return this.http.post<OrderValidationResponse>(this.apiUrl + '/create', orderData);;
}

  // PUT modifica ordine
  updateOrder(id: number, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}`, order);
  }

  // DELETE soft delete
  softDelete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // DELETE hard delete
  hardDelete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/hard`);
  }

  
 filterOrders(filters: OrderFilters): Observable<Order[]> {
   return this.http.post<Order[]>(`${this.apiUrl}/filter`, filters);
 }

  // Metodo per SOLO validazione (già esiste)
  validateOrder(order: Order): Observable<OrderValidationResponse> {
    return this.http.post<OrderValidationResponse>(`${this.apiUrl}/validate`, order);
  }

}
