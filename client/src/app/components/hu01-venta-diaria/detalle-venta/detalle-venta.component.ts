import { Component, OnInit } from '@angular/core';
import { DetalleVenta } from '../../../models/DetalleVenta';
import { VentaService } from '../../../services/principal-ventas/venta.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../../../services/login/login.service';
import { AlertaService } from '../../../services/alertas/alerta.service';
@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.component.html',
  styleUrl: './detalle-venta.component.css'
})
export class DetalleVentaComponent implements OnInit {
 
  detallesVenta: any[] = []; // Array para almacenar los detalles de la venta
  id_Venta: string=''
  tipoUsuario: string | null = null;

  // Agrega una propiedad para manejar el estado de los menús desplegables
   dropdownOpen: { [key: string]: boolean } = {};
   
  constructor(private ventaService: VentaService,
              private router:Router,
              private route:ActivatedRoute,
              private loginService:LoginService,
              private alertaService:AlertaService
  ) {}

  ngOnInit(): void {
    this.id_Venta = this.route.snapshot.paramMap.get('id_Venta')!;
    this.getDetallesVenta(this.id_Venta);
    this.loginService.currentUser$.subscribe(user => {
      if (user) {
        this.tipoUsuario = user.tipo_Usuario; // Aquí obtienes el tipo de usuario
        console.log('Usuario logueado:', user);
      }
    });
  }

  getDetallesVenta(id_Venta: string): void {
    this.ventaService.getDetallesVenta(id_Venta).subscribe((data:any[]) => {
        this.detallesVenta = data.map(detalle => ({
          ...detalle,
          id_Producto:detalle.id_Producto,
         nombre: detalle.nombre,
         codigo_Barras:detalle.codigo_Barras 
        }));
      });
    }
  
  volver(): void {
    this.router.navigate(['/ventas']);
  }

  editDetalleVenta(detalle: any): void {
    detalle.editing = true;
  }

  saveDetalleVenta(detalle: any): void {
    if (detalle.cantidad <= 0) {
      this.alertaService.showNotification('La cantidad debe ser mayor que cero.', 'error');
      return;
    }
  
    const updatedDetalle = {
        cantidad: detalle.cantidad,
        id_Producto: detalle.id_Producto,
        descuento: detalle.descuento
    };


    console.log('ID Detalle:', detalle.id_Detalle);
this.ventaService.updateDetalleVenta(detalle.id_Detalle,updatedDetalle)
  .subscribe(response => {

    console.log('Detalle de venta actualizado', response);
    detalle.editing = false; // Salir del modo de edición
    this.getDetallesVenta(this.id_Venta);
  }, error => {
    console.error('Error al actualizar el detalle de venta', error);
  });
}



deleteDetalleVenta(id_Detalle: number): void {
    this.ventaService.deleteDetalleVenta(id_Detalle)
      .subscribe(() => {
        this.alertaService.showNotification('Cambios guardados','success');
          this.getDetallesVenta(this.id_Venta); 
      }, error => {
          console.error('Error al eliminar detalle de venta', error);
      });
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
