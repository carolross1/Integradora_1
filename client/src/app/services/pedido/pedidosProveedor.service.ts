import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PedidoProveedor } from '../../models/Pedido'; // Importa el modelo de Pedido
import { Proveedor } from '../../models/Proveedores-list'; // Importa el modelo de Proveedor

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:3000/api/pedidos'; // URL base para la API de pedidos
  private proveedorApiUrl = 'http://localhost:3000/api/proveedores'; // URL base para la API de proveedores

  constructor(private http: HttpClient) { }

  // Método para registrar un nuevo pedido
  registrarPedido(pedido: Omit<PedidoProveedor, 'id_Pedido'>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, pedido)
      .pipe(
        tap(response => console.log('Respuesta del servidor al registrar pedido:', response)),
        catchError(error => {
          console.error('Error al registrar pedido:', error);
          return throwError(error);
        })
      );
  }

  // Método para obtener la lista de pedidos
  obtenerPedidos(): Observable<PedidoProveedor[]> {
    return this.http.get<PedidoProveedor[]>(this.apiUrl)
      .pipe(
        tap(response => console.log('Respuesta del servidor al obtener pedidos:', response)),
        catchError(error => {
          console.error('Error al obtener pedidos:', error);
          return throwError(error);
        })
      );
  }

  // Método para obtener un pedido específico por ID
  obtenerPedidoPorId(idPedido: number): Observable<PedidoProveedor> {
    return this.http.get<PedidoProveedor>(`${this.apiUrl}/${idPedido}`)
      .pipe(
        tap(response => console.log('Respuesta del servidor al obtener pedido:', response)),
        catchError(error => {
          console.error('Error al obtener pedido:', error);
          return throwError(error);
        })
      );
  }

  // Método para eliminar un pedido por ID
  eliminarPedido(idPedido: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${idPedido}`)
      .pipe(
        tap(response => console.log('Respuesta del servidor al eliminar pedido:', response)),
        catchError(error => {
          console.error('Error al eliminar pedido:', error);
          return throwError(error);
        })
      );
  }

  // Método para registrar detalles de un pedido
  registrarDetallesPedido(detalle: any): Observable<any> { // Ajusta el tipo de `detalle` según tu modelo
    return this.http.post<any>(`${this.apiUrl}/detalles-pedido`, detalle)
      .pipe(
        tap(response => console.log('Respuesta del servidor al registrar detalle de pedido:', response)),
        catchError(error => {
          console.error('Error al registrar detalle de pedido:', error);
          return throwError(error);
        })
      );
  }

  // Método para obtener los detalles de un pedido
  obtenerDetallesPedido(idPedido: number): Observable<any> { // Ajusta el tipo de `any` según tu modelo
    return this.http.get<any>(`${this.apiUrl}/detalles-pedido/${idPedido}`)
      .pipe(
        tap(response => console.log('Respuesta del servidor al obtener detalles de pedido:', response)),
        catchError(error => {
          console.error('Error al obtener detalles de pedido:', error);
          return throwError(error);
        })
      );
  }

  // Método para obtener la lista de proveedores
  obtenerProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.proveedorApiUrl)
      .pipe(
        tap(response => console.log('Respuesta del servidor al obtener proveedores:', response)),
        catchError(error => {
          console.error('Error al obtener proveedores:', error);
          return throwError(error);
        })
      );
  }

  // Método para obtener la información de un proveedor específico
  obtenerProveedorPorId(idProveedor: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.proveedorApiUrl}/${idProveedor}`)
      .pipe(
        tap(response => console.log('Respuesta del servidor al obtener proveedor:', response)),
        catchError(error => {
          console.error('Error al obtener proveedor:', error);
          return throwError(error);
        })
      );
  }

  // Método para enviar el correo al proveedor
  enviarCorreoProveedor(correo: string, mensaje: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/enviar-correo`, { destinatario: correo, asunto: 'Asunto del Correo', mensaje })
      .pipe(
        tap(response => console.log('Respuesta del servidor al enviar correo:', response)),
        catchError(error => {
          console.error('Error al enviar correo:', error);
          return throwError(error);
        })
      );
  }
}
