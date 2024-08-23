import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Factura } from '../../models/Factura';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private apiUrl = 'http://localhost:3000/api/facturas'; // URL del backend

  constructor(private http: HttpClient) {}
  
  getFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(this.apiUrl);
  }
  getFacturaById(id_Factura: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.apiUrl}/${id_Factura}`);
  }

  createFactura(factura: Factura): Observable<Factura> {
    return this.http.post<Factura>(this.apiUrl, factura);
  }
  getDetallesVenta(id_Venta: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/detalles/${id_Venta}`);
  }
  getTotalPorTicket(id_Venta: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/total/${id_Venta}`);
  }
  deleteFactura(id_Factura: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id_Factura}`);
  }
  updateFactura(factura: Factura): Observable<Factura> {
    return this.http.put<Factura>(`${this.apiUrl}/${factura.id_Factura}`, factura);
  }

}