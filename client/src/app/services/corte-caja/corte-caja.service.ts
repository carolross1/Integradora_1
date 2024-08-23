import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CorteCaja } from '../../models/CorteCaja';




@Injectable({
  providedIn: 'root'
})
export class CorteCajaService {

  private apiUrl = 'http://localhost:3000/api/cortecaja'; 

  constructor(private http: HttpClient) { }


  iniciarCorte(corte: Partial<CorteCaja>): Observable<any> {
    return this.http.post(`${this.apiUrl}/iniciar-corte`, corte);
  }
 
  cerrarCorte(corte: { id_Corte: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/cerrar-corte`, corte);
  }

  obtenerCorteActual(): Observable<CorteCaja> {
    return this.http.get<CorteCaja>(`${this.apiUrl}/corte-actual`);
  }
  obtenerCorteAbierto(id_Usuario: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/corte-abierto/${id_Usuario}`);
}

}