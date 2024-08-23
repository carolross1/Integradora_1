import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../services/productos/producto.service';
import { EntregaService } from '../../../services/entregas/entrega-proveedor.service';
import { LoginService } from '../../../services/login/login.service';
import { AlertaService } from '../../../services/alertas/alerta.service';
import { Router } from '@angular/router';
import { Producto } from '../../../models/Producto';
import { Entrega } from '../../../models/Entregas';
import { Proveedor } from '../../../models/Proveedores-list';
import { ProveedoresService } from '../../../services/Proveedores/proveedores-list.service';
import Swal from 'sweetalert2';
import { DetalleEntrega } from '../../../models/DetalleEntrega';

@Component({
  selector: 'app-entregas-proveedor',
  templateUrl: './entregas-proveedor.component.html',
  styleUrls: ['./entregas-proveedor.component.css']
})
export class EntregasProveedorComponent implements OnInit {
  codigoBarras: string = '';
  entregaProductos: Producto[] = [];
  proveedores: Proveedor[] = [];
  productos: Producto[] = [];
  totalEntrega: number = 0;
  subtotal: number = 0;
  cantidadTotal: number = 0;
  private debounceTimer: any;
  message: string = '';
  public dropdownOpen: { [key: string]: boolean } = {};
  currentDate: Date = new Date();
  currentUser: any = '';

  entrega: Omit<Entrega, 'id_Entrega'> = {
    id_Proveedor: 0,
    id_Factura: 0,
    fecha: new Date(),
    total: 0,
    id_Usuario: ''
  };

  constructor(
    private productoService: ProductoService,
    private entregaService: EntregaService,
    private loginService: LoginService,
    private router: Router,
    private alertaService: AlertaService,
    private proveedorService: ProveedoresService
  ) {}

  ngOnInit() {
    this.cargarProductos();
    this.cargarProveedores();
    this.currentDate = new Date();
    const currentUser = this.loginService.getCurrentUser() || {};
    this.entrega.id_Usuario = currentUser.id_Usuario;
    this.entrega.id_Proveedor = this.currentUser.id_Usuario || 0;
    this.entrega.fecha = this.currentDate;
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe(data => this.productos = data);
  }

  cargarProveedores() {
    this.proveedorService.getProveedores().subscribe(data => this.proveedores = data);
  }

  onProveedorChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedProveedorId = parseInt(selectElement.value, 10);
    this.entrega.id_Proveedor = selectedProveedorId;
  }

  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    const inputElement = keyboardEvent.target as HTMLInputElement;
    const codigoBarras = inputElement.value.trim();

    if (codigoBarras) {
      const producto = this.productos.find(p => p.codigo_Barras.toString() === codigoBarras);
      if (producto) {
        if (producto.cantidad_Stock > 0) {
          this.agregarProductoAEntrega(producto, 1);
          inputElement.value = '';
        } else {
          this.alertaService.showNotification('El producto está agotado y no se puede agregar a la entrega.', 'warning');
        }
      } else {
        this.alertaService.showNotification('Producto no encontrado.', 'warning');
      }
    }
  }

  onCodigoBarrasChange(event: KeyboardEvent) {
    clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(() => {
      const inputElement = event.target as HTMLInputElement;
      const codigoBarras = inputElement.value.trim();
      if (!codigoBarras) {
        return;
      }
      const producto = this.productos.find(p => p.codigo_Barras.toString() === codigoBarras);
      if (producto) {
        if (producto.cantidad_Stock > 0) {
          this.agregarProductoAEntrega(producto, 1); // Cantidad 1
          inputElement.value = '';
        } else {
          this.alertaService.showNotification('El producto está agotado y no se puede agregar a la entrega.', 'error');
        }
      } else {
        this.alertaService.showNotification('Producto no encontrado.', 'error');
      }
    }, 700);
  }

  agregarProductoAEntrega(producto: Producto, cantidad: number) {
    if (producto.cantidad_Stock < cantidad) {
      this.alertaService.showNotification('No hay suficiente stock del producto para la cantidad solicitada.', 'error');
      return;
    }

    const productoEnEntrega = this.entregaProductos.find(p => p.codigo_Barras === producto.codigo_Barras);
    if (productoEnEntrega) {
      productoEnEntrega.cantidad = (productoEnEntrega.cantidad || 0) + cantidad;
    } else {
      this.entregaProductos.push({ ...producto, cantidad: cantidad });
    }
    this.calcularTotales();
  }

  eliminarProductoDeEntrega(codigoBarras: number) {
    this.entregaProductos = this.entregaProductos.filter(p => p.codigo_Barras !== codigoBarras);
    this.calcularTotales();
  }

  calcularTotales() {
    this.subtotal = this.entregaProductos.reduce((acc, producto) => acc + producto.precio_Compra * (producto.cantidad ?? 0), 0);
    this.totalEntrega = this.subtotal;
  }

  actualizarStockProducto(codigoBarras: number, cantidad: number) {
    this.productoService.updateStock(codigoBarras, cantidad).subscribe(
      response => {
        console.log('Stock actualizado:', response);
      },
      error => {
        console.error('Error al actualizar el stock:', error);
      }
    );
  }

  registrarEntrega() {
    this.entrega.fecha = this.currentDate;
    this.entrega.total = this.totalEntrega;

    if (this.isFormValid()) {
      this.entregaService.registrarEntrega(this.entrega).subscribe({
        next: response => {
          console.log('Respuesta del servidor al registrar entrega:', response);
          const idEntrega = response.idEntrega;

          // Registrar detalles de la entrega
          const detallesEntrega$ = this.entregaProductos.map(producto => {
            const totalProducto = producto.precio_Venta * (producto.cantidad ?? 0);

            const detalleEntrega: DetalleEntrega = {
              id_Entrega: idEntrega,
              id_Producto: producto.id_Producto,
              cantidad: producto.cantidad ?? 0,
              total_entrega: totalProducto
            };

            return this.entregaService.registrarDetalle(detalleEntrega).toPromise();
          });

          Promise.all(detallesEntrega$).then(() => {
            // Vacía la entrega después de registrar todos los detalles
            this.vaciarEntrega();

            // Mostrar notificación de éxito
            Swal.fire({
              icon: 'success',
              title: 'Entrega registrada con éxito',
              text: 'La entrega y sus detalles se han registrado correctamente.',
              confirmButtonText: 'Aceptar'
            });
          }).catch(error => {
            console.error('Error al registrar el detalle de la entrega:', error);

            // Mostrar notificación de fallo
            Swal.fire({
              icon: 'error',
              title: 'Error al registrar la entrega',
              text: 'Hubo un problema al registrar los detalles de la entrega. Por favor, inténtelo nuevamente.',
              confirmButtonText: 'Aceptar'
            });
          });
        },
        error: error => {
          console.error('Error al registrar la entrega:', error);

          // Mostrar notificación de fallo
          Swal.fire({
            icon: 'error',
            title: 'Error al registrar la entrega',
            text: 'Hubo un problema al registrar la entrega. Por favor, inténtelo nuevamente.',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    } else {
      this.alertaService.showNotification('Por favor, complete todos los campos requeridos antes de registrar la entrega.', 'warning');
    }
  }

  vaciarEntrega() {
    this.entrega = {
      id_Proveedor: 0,
      id_Factura: 0,
      fecha: new Date(),
      total: 0,
      id_Usuario: this.currentUser.id_Usuario
    };
    this.entregaProductos = [];
    this.totalEntrega = 0;
    this.subtotal = 0;
    this.cantidadTotal = 0;
  }

  toggleDropdown(key: string) {
    for (const dropdownKey in this.dropdownOpen) {
      if (dropdownKey !== key) {
        this.dropdownOpen[dropdownKey] = false;
      }
    }
    this.dropdownOpen[key] = !this.dropdownOpen[key];
  }

  logout() {
    this.loginService.logout();
  }
  onIdFacturaChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;

    // Asegúrate de que solo se ingresen números y que el valor sea mayor a 0
    if (/^\d+$/.test(value)) {
      this.entrega.id_Factura = parseInt(value, 10);
    } else {
      inputElement.value = ''; // Limpia el campo si no es un número
      this.entrega.id_Factura = 0;
      // Opcionalmente, muestra un mensaje de error aquí
    }
  }

  isFormValid(): boolean {
    // Asegúrate de que id_Factura sea un número mayor a 0
    const isIdFacturaValid = typeof this.entrega.id_Factura === 'number' && this.entrega.id_Factura > 0;
    
    // Asegúrate de que id_Proveedor sea un número (o no sea null)
    const isProveedorValid = typeof this.entrega.id_Proveedor === 'number' && this.entrega.id_Proveedor !== null;
    
    // Asegúrate de que entregaProductos sea un array con longitud mayor a 0
    const isProductosValid = Array.isArray(this.entregaProductos) && this.entregaProductos.length > 0;
  
    // Verifica que todos los campos sean válidos
    return isIdFacturaValid && isProveedorValid && isProductosValid
  }
  
}