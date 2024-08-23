import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reportes } from '../../models/Reportes';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private API_URI: string = 'http://localhost:3000/api'; // URL base de tu API

  constructor(private http: HttpClient) { }

  obtenerReporte(fechaDesde: string, fechaHasta: string): Observable<any> {
    let params = new HttpParams()
      .set('fechaDesde', fechaDesde)
      .set('fechaHasta', fechaHasta);

    return this.http.get(`${this.API_URI}/reportes`, { params });
  }
}