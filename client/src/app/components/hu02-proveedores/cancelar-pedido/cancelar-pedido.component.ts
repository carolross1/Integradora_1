import { Component } from '@angular/core';
import { LoginService } from '../../../services/login/login.service';

@Component({
  selector: 'app-cancelar-pedido',
  templateUrl: './cancelar-pedido.component.html',
  styleUrls: ['./cancelar-pedido.component.css']
})

export class CancelarPedidoComponent {

  constructor(private loginService:LoginService){}

  // Declaración de la propiedad dropdownOpen
  dropdownOpen: { [key: string]: boolean } = {
    'ventas-compras': false,
    'proveedores-entregas': false,
    'inventarios-reportes': false,
    'otros': false
  };

  // Método para alternar el estado de los desplegables
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
  logout() {
    this.loginService.logout();
  }
}
