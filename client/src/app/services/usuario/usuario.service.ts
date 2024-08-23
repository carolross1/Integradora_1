import { Injectable } from '@angular/core';
import { Usuario } from '../../models/Usuario';
import { HttpClient } from '@angular/common/http';
import { Observable,throwError} from 'rxjs';
import { catchError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/api/usuarios'; 

  constructor(private http: HttpClient) { }

  // Crear un nuevo usuario
  createUser(user: Usuario): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, user)
    .pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  // Obtener todos los usuarios
  getUsers(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}`);
  }

  // Obtener un usuario por ID
  getUser(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }
    // Obtener el usuario actual (si existe un endpoint para esto)
    getCurrentUser(): Observable<Usuario> {
      return this.http.get<Usuario>(`${this.apiUrl}/current`); // Asegúrate de que este endpoint sea correcto
    }

  // Actualizar un usuario
  updateUser(id_Usuario: string,user:Usuario): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id_Usuario}`, user)
    .pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  // Eliminar un usuario
  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}