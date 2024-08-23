import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Entrega } from '../../models/Entregas';
import { DetalleEntrega } from '../../models/DetalleEntrega';
import { catchError, tap } from 'rxjs/operators';
import { UsuarioService } from '../../services/usuario/usuario.service'; // Importa el servicio de usuarios

@Injectable({
  providedIn: 'root'
})
export class EntregaService {
  private apiUrl = 'http://localhost:3000/api/entregas'; // URL para las entregas
  private userApiUrl = 'http://localhost:3000/api/usuarios'; // URL para los usuarios

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService // Añade el servicio de usuarios
  ) { }

  registrarEntrega(entrega: Omit<Entrega, 'id_Entrega'>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, entrega)
      .pipe(
        tap(response => console.log('Respuesta del servidor al registrar entrega:', response)),
        catchError(error => {
          console.error('Error al registrar entrega:', error);
          return throwError(error);
        })
      );
  }

  registrarDetalle(detalle: DetalleEntrega): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/detalle/create`, detalle)
      .pipe(
        tap(response => console.log('Respuesta del servidor al registrar detalle de entrega:', response)),
        catchError(error => {
          console.error('Error al registrar detalle de entrega:', error);
          return throwError(error);
        })
      );
  }

  // Método para obtener los detalles de una entrega
  registrarDetalles(detalles: DetalleEntrega[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/detalle/create`, detalles)
      .pipe(
        tap(response => console.log('Respuesta del servidor al registrar detalles de entrega:', response)),
        catchError(error => {
          console.error('Error al registrar detalles de entrega:', error);
          return throwError(error);
        })
      );
  }

  // Método para obtener el usuario actual
  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.userApiUrl}/current`) // Asegúrate de que este endpoint sea correcto
      .pipe(
        tap(response => console.log('Respuesta del servidor al obtener usuario actual:', response)),
        catchError(error => {
          console.error('Error al obtener usuario actual:', error);
          return throwError(error);
        })
      );
  }
  deleteEntrega(idEntrega: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${idEntrega}`)
      .pipe(
        tap(response => console.log('Respuesta del servidor al eliminar entrega:', response)),
        catchError(error => {
          console.error('Error al eliminar entrega:', error);
          return throwError(error);
        })
      );
  }
  
  
  // Método para editar el stock de un producto
  updateStock(codigoBarras: string, cantidad: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/producto/update-stock`, { codigoBarras, cantidad })
      .pipe(
        tap(response => console.log('Respuesta del servidor al actualizar stock:', response)),
        catchError(error => {
          console.error('Error al actualizar stock:', error);
          return throwError(error);
        })
      );
  }
}
