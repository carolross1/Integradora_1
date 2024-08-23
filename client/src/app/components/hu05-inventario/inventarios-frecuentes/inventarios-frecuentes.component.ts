import { Component, OnInit,ElementRef,ViewChildren,QueryList} from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { InventarioService } from '../../../services/inventario/inventario.service';
import { ProductoService } from '../../../services/productos/producto.service';
import { Producto } from '../../../models/Producto';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login/login.service';
import Swal from 'sweetalert2';
import { AlertaService } from '../../../services/alertas/alerta.service';


@Component({
  selector: 'app-inventarios-frecuentes',
  templateUrl: './inventarios-frecuentes.component.html',
  styleUrls: ['./inventarios-frecuentes.component.css']
})
export class InventariosFrecuentesComponent implements OnInit {
  @ViewChildren('cantidadFisicaInput') cantidadFisicaInputs!: QueryList<ElementRef>;
  idInventario: number=0;
  productos: any[] = [];
  productosFiltrados: any[] = [];
  searchTerm: string='';
  searchTermC: string='';
 
  constructor(
    private productoService: ProductoService,
    private inventarioService: InventarioService,
    private route: ActivatedRoute,
    private router: Router,
    private loginService:LoginService,
    private alertaService:AlertaService
  ) { }
  ngOnInit(): void {
    const idInventarioParam = this.route.snapshot.paramMap.get('id');
    this.idInventario = idInventarioParam ? Number(idInventarioParam) : 0;
    console.log('ID Inventario:', this.idInventario); 
    this.cargarProductos();
  }
  cargarProductos() {
    this.productoService.getProductos().subscribe(
      (productos) => {
        console.log('Productos cargados:', productos); // Verifica los datos aquí console.log('Productos cargados:', productos); // Verifica los datos aquí
        this.productos = productos;
        this.productosFiltrados = productos;
      },
      (error) => {
        console.error('Error al cargar productos', error);
      }
    );
  }

    searchProductos(): void {
      const termNombre = this.searchTerm.toString().trim().toLowerCase();
      const termNumero = this.searchTermC.toString().trim();
    
      this.productosFiltrados = this.productos.filter(p => {
        const matchNombre = p.nombre.toLowerCase().includes(termNombre);
        const matchNumero = p.codigo_Barras.toString().includes(termNumero);
        
        // Si ambos términos están presentes, se deben cumplir ambos criterios
        if (termNombre && termNumero) {
          return matchNombre && matchNumero;
        }
        
        // Si solo uno de los términos está presente, se filtra por el que tenga valor
        if (termNombre) {
          return matchNombre;
        }
    
        if (termNumero) {
          return matchNumero;
        }
    
        return true; // Si no hay términos de búsqueda, devuelve todos los productos
      });
    }
    onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Enter' && this.productosFiltrados.length === 1) {
        // Enfocar el campo cantidad_Fisica del producto encontrado
        const inputElement = this.cantidadFisicaInputs.first.nativeElement;
        inputElement.focus();
        inputElement.select();
      }
    }

  onCantidadFisicaChange(producto: any): void {
    const cantidadFisica = producto.cantidadFisica !== undefined ? Number(producto.cantidadFisica) : 0;
    producto.faltante = producto.cantidad_Stock - (isNaN(cantidadFisica) ? 0 : cantidadFisica);
  }

  calcularFaltante(producto: any): number {
    const cantidadFisica = producto.cantidadFisica !== undefined ? Number(producto.cantidadFisica) : 0;
    return (producto.nuevaCantidadStock !== undefined ? producto.nuevaCantidadStock : producto.cantidad_Stock) - (isNaN(cantidadFisica) ? 0 : cantidadFisica);
  }
  editarStock(producto: any): void {
    Swal.fire({
      title: 'Ingrese la nueva cantidad en stock:',
      input: 'number',
      inputValue: producto.cantidad_Stock,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (isNaN(Number(value)) || Number(value) < 0) {
          return 'Por favor, ingrese un número válido.';
        }
        return null; // No hay error, continuar
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevaCantidadNumero = Number(result.value);
        producto.nuevaCantidadStock = nuevaCantidadNumero;
        console.log('Producto actualizado:', producto); // Verifica los datos aquí
        this.productoService.updateStock(producto.id_Producto, nuevaCantidadNumero).subscribe(
          (response) => {
            console.log('Stock actualizado');
            this.alertaService.showNotification('Stock actualizado exitosamente.', 'success');

          },
          (error) => {
            this.alertaService.showNotification('Error al actualizar stock.', 'error');
          }
        );
      }
    });
  }
  guardarDetalles(): void {
    const detallesInventario = this.productos.map(producto => ({
      idInventario: this.idInventario,
      idProducto: producto.id_Producto,
      cantidadFisica: producto.cantidadFisica
    }));

    console.log("esto es los detalles",detallesInventario)
      this.inventarioService.guardarDetallesInventario(detallesInventario).subscribe(
      (response) => {
        console.log('Detalles de inventario guardados');
      },
      (error) => {
        console.error('Error al guardar detalles de inventario', error);
      }
    );
    this.productos.forEach(producto => {
      if (producto.nuevaCantidadStock !== undefined) {
        this.productoService.updateStock(producto.id_Producto, producto.nuevaCantidadStock).subscribe(
          (response) => {
            console.log('Stock actualizado');
          },
          (error) => {
            console.error('Error al actualizar stock', error);
          }
        );
      }
    });
  }
  closeInventario(): void {
    this.inventarioService.closeInventario(this.idInventario).subscribe(response => {
        console.log('Respuesta del servidor:', response);
        this.alertaService.showNotification('Inventario cerrado exitosamente.','success');
        this.router.navigate(['/inventarios']); 
      }, error => {
        console.error('Error al cerrar el inventario:', error);
        this.alertaService.showNotification('Hubo un error al cerrar el inventario.','error');
      });
  }
  guardarDetallesYcerrarInventario() {
    this.guardarDetalles(); // Llama la función para guardar detalles
    this.closeInventario(); // Llama la función para cerrar inventario
  }
  
  // Definir el estado de los menús desplegables
  dropdownOpen: { [key: string]: boolean } = {
    inventarios: false,
    usuarios: false
  };

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