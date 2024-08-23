import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../services/productos/producto.service';
import { PedidoService } from '../../../services/pedido/pedidosProveedor.service';
import { LoginService } from '../../../services/login/login.service';
import { AlertaService } from '../../../services/alertas/alerta.service';
import { Router } from '@angular/router';
import { Producto } from '../../../models/Producto';
import { PedidoProveedor, DetallePedido } from '../../../models/Pedido';
import { Proveedor } from '../../../models/Proveedores-list';
import { ProveedoresService } from '../../../services/Proveedores/proveedores-list.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedidos-a-proveedor',
  templateUrl: './pedidos-a-proveedor.component.html',
  styleUrls: ['./pedidos-a-proveedor.component.css']
})
export class PedidosProveedorComponent implements OnInit {
  dropdownOpen: { [key: string]: boolean } = {};
  currentDate: Date = new Date();
  proveedores: Proveedor[] = [];
  productos: Producto[] = [];
  correo: string = ''; // Añadido para almacenar el correo del proveedor
  compra: PedidoProveedor = {
    id_Proveedor: 0,
    fecha_Pedido: this.currentDate,
   
    detalles: [],
    total: 0
  };
  totalCompra: number = 0;
  debounceTimer: any;

  constructor(
    private productoService: ProductoService,
    private proveedorService: ProveedoresService,
    private loginService: LoginService,
    private alertaService: AlertaService,
    private router: Router,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarProveedores();
    const currentUser = this.loginService.getCurrentUser() || {};
    this.compra.id_Proveedor = this.compra.id_Proveedor || 0;
    this.compra.fecha_Pedido = this.currentDate;
    
 
  }

  cargarProductos(): void {
    this.productoService.getProductos().subscribe(data => this.productos = data);
  }

  cargarProveedores(): void {
    this.proveedorService.getProveedores().subscribe(data => this.proveedores = data);
  }

  onProveedorChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedProveedorId = parseInt(selectElement.value, 10);
    this.compra.id_Proveedor = selectedProveedorId;
  
    // Encuentra el proveedor seleccionado y actualiza el correo
    const proveedorSeleccionado = this.proveedores.find(proveedor => proveedor.id_Proveedor === selectedProveedorId);
    if (proveedorSeleccionado) {
      if (proveedorSeleccionado.email) {
        this.correo = proveedorSeleccionado.email; // Actualiza el correo
      } else {
        console.warn('El proveedor seleccionado no tiene un email definido.');
        this.correo = 'Email no disponible'; // Mensaje alternativo en caso de falta de correo
      }
    } else {
      console.warn('Proveedor no encontrado.');
      this.correo = 'Proveedor no encontrado'; // Mensaje alternativo en caso de no encontrar el proveedor
    }
  }
  

  onCodigoBarrasChange(event: KeyboardEvent): void {
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
          this.agregarProductoACompra(producto, 1); // Cantidad 1
          inputElement.value = '';
        } else {
          this.alertaService.showNotification('El producto está agotado y no se puede agregar al pedido.', 'error');
        }
      } else {
        this.alertaService.showNotification('Producto no encontrado.', 'error');
      }
    }, 700);
  }

  onEnterKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    const inputElement = keyboardEvent.target as HTMLInputElement;
    const codigoBarras = inputElement.value.trim();

    if (codigoBarras) {
      const producto = this.productos.find(p => p.codigo_Barras.toString() === codigoBarras);
      if (producto) {
        if (producto.cantidad_Stock > 0) {
          this.agregarProductoACompra(producto, 1);
          inputElement.value = '';
        } else {
          this.alertaService.showNotification('El producto está agotado y no se puede agregar al pedido.', 'warning');
        }
      } else {
        this.alertaService.showNotification('Producto no encontrado.', 'warning');
      }
    }
  }

  agregarProductoACompra(producto: Producto, cantidad: number): void {
    // Calcula el total del detalle basado en el precio y la cantidad
    const totalDetalle = producto.precio_Compra * cantidad;
  
    // Crea el detalle del pedido con el total calculado
    const detalle: DetallePedido = {
      id_Pedido: this.compra.id_Pedido || 0,
      id_Producto: producto.id_Producto,
      cantidad: cantidad,
      nombre: producto.nombre,
      codigo_Barras: producto.codigo_Barras,
      precio: producto.precio_Compra,
      total: totalDetalle // Asigna el total calculado
    };
  
    // Agrega el detalle al pedido
    this.compra.detalles.push(detalle);
  
    // Llama a calcularTotales después de agregar el producto
    this.calcularTotales();
  }
  

  calcularTotales(): void {
    // Calcula el total sumando el total de cada detalle
    this.totalCompra = this.compra.detalles.reduce((total, detalle) => {
      // Calcula el total por detalle (precio * cantidad)
      const detalleTotal = detalle.precio * (detalle.cantidad ?? 0);
      // Suma el total del detalle al total general
      return total + detalleTotal;
    }, 0);
    
    // Actualiza el total del pedido
    this.compra.total = this.totalCompra;
  }
  

  eliminarProductoDeCompra(idProducto: number): void {
    this.compra.detalles = this.compra.detalles.filter(detalle => detalle.id_Producto !== idProducto);
    this.calcularTotales();
  }

  vaciarCompra(): void {
    this.compra = {
      id_Proveedor: 0,
      fecha_Pedido: new Date(),
      detalles: [],
      total: 0
    };
    this.totalCompra = 0;
  }

  registrarPedido(): void {
    if (this.isFormValid()) {
      this.pedidoService.registrarPedido(this.compra).subscribe({
        next: response => {
          console.log('Respuesta del servidor al registrar pedido:', response);
          const idPedido = response.idPedido;
  
          // Registrar detalles del pedido
          const detallesPedido$ = this.compra.detalles.map(detalle => {
            // Construir el detalle del pedido
            const detallePedido: DetallePedido = {
              id_Pedido: idPedido, // Utilizar el idPedido devuelto para los detalles
              id_Producto: detalle.id_Producto,
              nombre: detalle.nombre,
              precio: detalle.precio,
              codigo_Barras: detalle.codigo_Barras,
              cantidad: detalle.cantidad ?? 0,
              total: detalle.total ?? 0
            };
  
            // Devolver el observable para cada detalle del pedido
            return this.pedidoService.registrarDetallesPedido(detallePedido).toPromise();
          });
  
          Promise.all(detallesPedido$).then(() => {
            // Vacía el pedido después de registrar todos los detalles
            this.vaciarCompra();
  
            // Mostrar notificación de éxito
            Swal.fire({
              icon: 'success',
              title: 'Pedido registrado con éxito',
              text: 'El pedido y sus detalles se han registrado correctamente.',
              confirmButtonText: 'Aceptar'
            });
          }).catch(error => {
            console.error('Error al registrar el detalle del pedido:', error);
  
            // Mostrar notificación de fallo
            Swal.fire({
              icon: 'error',
              title: 'Error al registrar el pedido',
              text: 'Hubo un problema al registrar los detalles del pedido. Por favor, inténtelo nuevamente.',
              confirmButtonText: 'Aceptar'
            });
          });
        },
        error: error => {
          console.error('Error al registrar el pedido:', error);
  
          // Mostrar notificación de fallo
          Swal.fire({
            icon: 'error',
            title: 'Error al registrar el pedido',
            text: 'Hubo un problema al registrar el pedido. Por favor, inténtelo nuevamente.',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    } else {
      this.alertaService.showNotification('Por favor, complete todos los campos requeridos antes de registrar el pedido.', 'warning');
    }
  }
  
  isFormValid(): boolean {
    return this.compra.id_Proveedor > 0 && this.compra.detalles.length > 0 
  }

  toggleDropdown(key: string): void {
    for (const dropdownKey in this.dropdownOpen) {
      if (dropdownKey !== key) {
        this.dropdownOpen[dropdownKey] = false;
      }
    }
    this.dropdownOpen[key] = !this.dropdownOpen[key];
  }

  logout(): void {
    this.loginService.logout();
  }

  submitForm(): void {
    this.registrarPedido();
  }
}
