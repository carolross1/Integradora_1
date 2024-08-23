import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Asegúrate de importar Router
import { InventarioService } from '../../../services/inventario/inventario.service';
import { LoginService } from '../../../services/login/login.service';
import { NgForm } from '@angular/forms';
import { AlertaService } from '../../../services/alertas/alerta.service';



@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'] // Cambiado de styleUrl a styleUrls
})
export class InventarioComponent implements OnInit{
  inventario = {
    fechaInicio: new Date(),
    usuario: ''
  };
  constructor(
    private inventarioService: InventarioService,
    private router: Router,
    private loginService: LoginService,
    private alertaService:AlertaService
  ) { }

  ngOnInit(): void {
    const currentUser = this.loginService.getCurrentUser();
    console.log('Usuario actual:', currentUser);
    this.inventario.usuario = currentUser.id_Usuario;
  }

  crearInventario(form:NgForm) {
    if (form.valid) {
      console.log(this.inventario);
    
    console.log('Inventario a crear:', this.inventario); // Verifica el objeto inventario
    this.inventarioService.createInventario(this.inventario).subscribe(response => {
      console.log('Respuesta del servidor:', response); // Verifica la respuesta del servidor
     
      const mensaje = `Se registró el inventario con éxito. Fecha de inicio: ${this.inventario.fechaInicio}`;
      console.log('Mensaje de notificación:', mensaje); // Verifica el mensaje de notificación
      
      this.alertaService.showNotification(mensaje, 'success');
      this.router.navigate(['/inventariofrecuente', response.id]);
    }, error => {
      console.error('Error al crear el inventario:', error); // Maneja cualquier error
      this.alertaService.showNotification('Hubo un error al registrar el inventario.', 'error');
    });
  } else {
    console.log('Inventario inválido');
  }
}
  dropdownOpen: { [key: string]: boolean } = {}; // Estado de los menús desplegables
  
  toggleDropdown(key: string): void {
    // Primero, cerrar cualquier otro desplegable que esté abierto
    for (const dropdownKey in this.dropdownOpen) {
      if (dropdownKey !== key) {
        this.dropdownOpen[dropdownKey] = false;
      }
    }
    // Alternar el estado del desplegable actual
    this.dropdownOpen[key] = !this.dropdownOpen[key];
  }

  // Define el método redirectTo que utiliza el Router para navegar a la URL proporcionada
  redirectTo(url: string): void {
    this.router.navigate([url]);
  }
  logout() {
    this.loginService.logout();
  }
}