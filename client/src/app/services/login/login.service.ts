import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CorteCajaService } from '../corte-caja/corte-caja.service';


export interface LogoutResponse {
  success: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:3000/api/login';

  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router,private corteCajaService:CorteCajaService) {}

  login(usuario: string, contrasena: string): Observable<any> {
    const body = { usuario, contrasena };
    return this.http.post<any>(this.apiUrl, body);
  }

  setCurrentUser(user: any) {
    this.currentUserSubject.next(user);
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }
  
  logout(): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      console.log('este es del login:',currentUser)
      // Si no hay usuario actual, redirigir al login
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar el estado del corte abierto antes de proceder
    this.corteCajaService.obtenerCorteAbierto(currentUser.id_Usuario).subscribe(
      response => {
        if (response && response.id_Corte) {
          // Hay un corte abierto, mostrar alerta y redirigir
          Swal.fire({
            icon: 'warning',
            title: 'Cierre de sesión no permitido',
            text: 'No puedes cerrar sesión sin realizar un corte final. REALIZA EL CORTE ANTES DE SALIR',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigate(['/cortedecaja']);
          });
          
          return false; // Indica que el logout no se realizó
        } else {
          // No hay corte abierto, proceder con el cierre de sesión
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          this.router.navigate(['/login']);
          return true;
        }
      },  
      error => {
        if (error.status === 404) {
          // Si el error es 404, significa que no se encontró un corte abierto, proceder con el cierre de sesión
          this.finalizarSesion();
          return true;
        } else {
          console.error('Error al verificar el estado del corte:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al verificar el estado del corte.',
            confirmButtonText: 'Aceptar'
          });
          return false;
        }
      }
    );
    return false; // Retornar falso por defecto ya que la verificación es asíncrona
  }

  private finalizarSesion(): void {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
    console.log('Sesión cerrada correctamente');
  }
}