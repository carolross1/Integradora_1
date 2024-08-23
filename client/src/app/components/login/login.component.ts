import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login/login.service';
import { AlertaService } from '../../services/alertas/alerta.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario: string = '';
  contrasena: string = '';
  message: string = '';
  errorMessage="";

  constructor(private loginService: LoginService, private router: Router,private alertaService:AlertaService) {}

  login() {
    this.loginService.login(this.usuario, this.contrasena).subscribe(
      response => {
        if (response.success) {
          this.message = 'Inicio de sesión exitoso';
          this.loginService.setCurrentUser(response.usuario);
          this.alertaService.showNotification('Inicio de sesión exitoso', 'success');
  
          // Verificar el valor de tipo_Usuario
          console.log('Usuario logueado:', response.usuario);
  
          // Redirigir según el rol del usuario
          if (response.usuario.tipo_Usuario.toLowerCase() === 'admin') {
            this.router.navigate(['/menu']);
          } else {
            this.router.navigate(['/cortedecaja']);
          }
        } else {
          this.message = response.message;
          this.alertaService.showNotification(response.message, 'error');
          this.errorMessage = response.message; // Actualiza la propiedad errorMessage
        }
      },
      error => {
        this.message = 'Error al iniciar sesión';
        this.alertaService.showNotification('Error al iniciar sesión', 'error'); 
        console.error(error);
        this.errorMessage = error.error?.message || 'Error desconocido'; // Actualiza la propiedad errorMessage
      }
    );
  }
}