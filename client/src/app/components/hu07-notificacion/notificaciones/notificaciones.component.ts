import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ProductoService } from '../../../services/productos/producto.service';
import { Producto } from '../../../models/Producto';
import { LoginService } from '../../../services/login/login.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})

export class NotificacionesComponent implements OnInit {

  productos: Producto[] = [];
  atendidoState: { [key: number]: boolean } = {}; // Estado de atendido por ID de producto
  dropdownOpen: { [key: string]: boolean } = {
    'ventas-compras': false,
    'proveedores-entregas': false,
    'inventarios-reportes': false,
    'otros': false
  };

  @Output() notificacionesNoAtendidas = new EventEmitter<number>();

  constructor(private productoService: ProductoService,private loginService:LoginService) { }

  ngOnInit(): void {
    this.getProductosBajoStock();
  }

  getProductosBajoStock(): void {
    this.productoService.getProductosBajoStock().subscribe(
      (data: Producto[]) => {
        console.log('Productos con bajo stock:', data); // Verifica los datos aquí
        this.productos = data;
        this.notificacionesNoAtendidas.emit(this.productos.length);
      },
      error => console.error('Error al obtener productos con bajo stock', error)
    );
  }

  realizarPedido(id_Producto: number): void {
    this.atendidoState[id_Producto] = true; // Marcar como atendido
  }

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
