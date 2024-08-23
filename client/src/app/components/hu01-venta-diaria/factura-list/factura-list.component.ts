import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacturaService } from '../../../services/factura/factura.service';
import { Factura } from '../../../models/Factura';
import { LoginService } from '../../../services/login/login.service';

@Component({
  selector: 'app-factura-list',
  templateUrl: './factura-list.component.html',
  styleUrl: './factura-list.component.css'
})
export class FacturaListComponent implements OnInit {
  facturas: Factura[] = [];
  tipoUsuario: string | null = null; 
  
 // Agrega una propiedad para manejar el estado de los menús desplegables
 dropdownOpen: { [key: string]: boolean } = {};
  constructor(private facturaService: FacturaService, 
    private router: Router,
  private loginService:LoginService) {}

  ngOnInit(): void {
    this.cargarFacturas();
    this.loginService.currentUser$.subscribe(user => {
      if (user) {
        this.tipoUsuario = user.tipo_Usuario; // Aquí obtienes el tipo de usuario
        console.log('Usuario logueado:', user);
      }
    });
  }

  cargarFacturas(): void {
    this.facturaService.getFacturas().subscribe((data: Factura[]) => {
      this.facturas = data;
    });
  }

  verDetalle(id_Factura: number): void {
    this.router.navigate(['/factura', id_Factura]);
  }

  editarFactura(id_Factura: number): void {
    this.router.navigate(['/editar-factura', id_Factura]);
  }

  eliminarFactura(id_Factura: number): void {
    if (confirm('¿Estás seguro de eliminar esta factura?')) {
      this.facturaService.deleteFactura(id_Factura).subscribe(() => {
        this.cargarFacturas(); // Recargar la lista después de eliminar
      });
    }
  }

  crearFactura(): void {
    this.router.navigate(['/crear-factura']);
  }
  toggleDropdown(key: string) {
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