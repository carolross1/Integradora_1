import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventario } from '../../models/Inventario';
import { DetalleInventario } from '../../models/DetalleInventario';


@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private apiUrl = 'http://localhost:3000/api/inventarios';
constructor(private http: HttpClient) { }

  createInventario(inventario: Inventario): Observable<any> {
    return this.http.post(`${this.apiUrl}`, inventario);
  }

  getInventarios(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(`${this.apiUrl}`);
  }

  closeInventario(idInventario: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/close/${idInventario}`, {});
  }

  guardarDetallesInventario(detalles: any[]): Observable<any> {
    console.log('Detalles antes de enviar:', detalles);
    return this.http.put(`${this.apiUrl}/detalle`, detalles);
  }
}