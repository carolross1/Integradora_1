import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta } from '../../models/Venta';
import { DetalleVenta } from '../../models/DetalleVenta';
import { catchError } from 'rxjs';
import { tap } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private apiUrl = 'http://localhost:3000/api/ventas';  

  constructor(private http: HttpClient) { }
  registrarVenta(venta: Omit<Venta, 'id_Venta'>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, venta)
      .pipe(
        tap(response => console.log('Respuesta del servidor al registrar venta:', response)),
        //GUARDAR EL dATo de id_venta y el id producto en una variable
        catchError(error => {
          console.error('Error al registrar venta:', error);
          return throwError(error);
        })
      );
  }

  registrarDetalle(detalle: DetalleVenta): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/detalle/create`, detalle)
      .pipe(
        tap(response => console.log('Respuesta del servidor al registrar detalle de venta:', response)),
        catchError(error => {
          console.error('Error al registrar detalle de venta:', error);
          return throwError(error);
        })
      );
  }
  deleteVenta(id_Venta: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/ventad/${id_Venta}`);
  }
  getVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.apiUrl}/lista`);
  }
  getDetallesVenta(id_Venta:string): Observable<DetalleVenta[]> {
    return this.http.get<DetalleVenta[]>(`${this.apiUrl}/detalle-venta/lista/${id_Venta}`);
  }
  updateDetalleVenta(id_Detalle: number, detalle: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/detalle-venta/${id_Detalle}`, detalle);
  }

  deleteDetalleVenta(id_Detalle: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/detalle-venta/${id_Detalle}`);
  }
}