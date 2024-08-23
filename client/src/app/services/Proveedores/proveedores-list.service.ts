import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proveedor } from '../../models/Proveedores-list';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  private apiUrl = 'http://localhost:3000/api/proveedores'; // Ajusta la URL según tu configuración

  constructor(private http: HttpClient) {}

  getProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.apiUrl);
  }

  addProveedor(proveedor: Omit<Proveedor, 'id_Proveedor'>): Observable<void> {
    return this.http.post<void>(this.apiUrl, proveedor);
  }

  deleteProveedor(idProveedor: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idProveedor}`);
  }
  

  updateProveedor(id: number, proveedor: Proveedor): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, proveedor);
  }
}
