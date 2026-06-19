import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Product {
  private http = inject(HttpClient);
  URI: string = 'http://localhost:3000/productos';

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getProducts(): Observable<any> {
    return this.http.get(this.URI, { headers: this.getAuthHeaders() });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.URI}/${id}`, { headers: this.getAuthHeaders() });
  }

  updateProduct(id: number, producto: any): Observable<any> {
    return this.http.put(`${this.URI}/${id}`, producto, { headers: this.getAuthHeaders() });
  }

  saveProduct(producto: any): Observable<any> {
    return this.http.post(this.URI, producto, { headers: this.getAuthHeaders() });
  }
}