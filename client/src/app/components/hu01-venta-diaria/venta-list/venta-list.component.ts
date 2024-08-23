import { Component,OnInit } from '@angular/core';
import { VentaService } from '../../../services/principal-ventas/venta.service';
import { Venta } from '../../../models/Venta';
import { LoginService } from '../../../services/login/login.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-venta-list',
  templateUrl: './venta-list.component.html',
  styleUrl: './venta-list.component.css'
})
export class VentaListComponent implements OnInit{

ventas: any[] = [];
tipoUsuario: string | null = null;

 // Agrega una propiedad para manejar el estado de los menús desplegables
 dropdownOpen: { [key: string]: boolean } = {};

constructor(private ventaService:VentaService,private loginService:LoginService, private router:Router){}

ngOnInit(): void {
  this.cargarVentas();
  this.loginService.currentUser$.subscribe(user => {
    if (user) {
      this.tipoUsuario = user.tipo_Usuario; // Aquí obtienes el tipo de usuario
      console.log('Usuario logueado:', user);
    }
  });
}

cargarVentas(): void {
  this.ventaService.getVentas().subscribe((data:any[]) => {
    this.ventas = data.map(venta => ({
      ...venta,
      total_ventas: venta.total_ventas 
    }));
  });
}
verDetalle(id_Venta : string): void {
  this.router.navigate(['/detalles', id_Venta]);
}
 // Método para eliminar una venta
 eliminarVenta(id_Venta: string) {
  this.ventaService.deleteVenta(id_Venta).subscribe(
    response => {
      console.log('Venta eliminada:', response);
      this.cargarVentas(); // Volver a obtener la lista actualizada
    },
    error => {
      console.error('Error al eliminar la venta:', error);
    }
  );
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
