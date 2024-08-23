import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AutenticacionService } from './autenticacion.service';  // Ajusta la ruta si es necesario

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AutenticacionService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;  // Permite el acceso a la ruta
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Acceso denegado',
        text: 'Debes iniciar sesión para acceder a esta página.',
        confirmButtonText: 'OK'
      }).then(() => {
        this.router.navigate(['/login']);
      });
      return false;  
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AutenticacionService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAdmin()) {
      return true; 
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Acceso denegado',
        text: 'No tienes permisos para acceder a esta página.',
        confirmButtonText: 'OK'
      }).then(() => {
        this.router.navigate(['/acceso-denegado']);
      });
      return false;  // Bloquea el acceso a la ruta
    }
  }
}
