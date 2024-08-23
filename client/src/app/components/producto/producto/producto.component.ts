import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProductoService } from '../../../services/productos/producto.service';
import { Producto } from '../../../models/Producto';  
import { CategoriaService } from '../../../services/categoria/categoria.service';
import { Categoria } from '../../../models/Categoria';
import { LoginService } from '../../../services/login/login.service';
import { Router } from '@angular/router';
import { AlertaService } from '../../../services/alertas/alerta.service';

@Component({
  selector: 'app-producto',
  templateUrl:'./producto.component.html',
  styleUrls: ['./producto.component.css'] // Corregido de styleUrl a styleUrls
})
export class ProductoComponent implements OnInit {
  

  productos: Producto[] = [];
  filteredProductos: Producto[] = []; 
  searchTerm: string = '';
  producto: Producto = {
    id_Producto: 0,
    nombre: '',
    id_Categoria: 0,
    precio_Compra: 0,
    precio_Venta: 0,
    utilidad: 0,
    cantidad_Stock: 0,
    cant_Minima: 0,
    codigo_Barras: 0
  };
  categorias: Categoria[] = [];
  editando: boolean = false;
  mostrarProductos: boolean = false;
  errorMessage="";
  inputError = false;
  tipoUsuario: string | null = null;

  // Agrega una propiedad para manejar el estado de los menús desplegables
  dropdownOpen: { [key: string]: boolean } = {};
  validateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
  
    // Verifica si el valor ingresado es un número válido
    if (isNaN(Number(value)) || Number(value) < 1) {
      this.inputError = true;
      input.value = ''; // Limpia el campo si el valor no es válido
    } else {
      this.inputError = false;
    }
  }
  
  validateInputCode(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
  
    // Valida el código de barras para que tenga entre 12 y 13 dígitos
    this.inputError = isNaN(Number(value)) || value.length < 12 || value.length > 13;
  }

  constructor(private productoService: ProductoService, 
    private categoriaService: CategoriaService,
  private loginService:LoginService,
private alertaService:AlertaService,
private router:Router) { }

  ngOnInit() {
    this.getCategorias();
    this.cargarProductos();
    this.loginService.currentUser$.subscribe(user => {
      if (user) {
        this.tipoUsuario = user.tipo_Usuario; 
        console.log('Usuario logueado:', user);
      }
    });
  }

  getCategorias(): void {
    this.categoriaService.getCategorias().subscribe(categorias => {
      this.categorias = categorias;
      if (this.categorias.length > 0 && !this.editando) {
        this.producto.id_Categoria = this.categorias[0].id_Categoria;
      }
    });
  } 
  cargarProductos() {
    this.productoService.getProductos().subscribe(data => {
      this.productos = data;
      this.filteredProductos = data; 
    });
  }

  private markAllAsTouched(form: NgForm) {
    Object.values(form.controls).forEach((control: any) => {
      control.markAsTouched(); 
    });
  }

  guardarProducto(form: NgForm) {
    console.log('Formulario enviado', form);
    if (form.invalid) {
      this.markAllAsTouched(form);
      return;
    }
    if (form.valid) {
      
      if (this.editando) {
        this.productoService.updateProducto(this.producto).subscribe(
          response => {
            this.alertaService.showNotification('Producto actualizado','success');
            console.log('Producto actualizado:', response);
            form.resetForm(); // Limpiar el formulario después de la actualización
            this.handlePostSubmitActions();
          },
          error => {
            this.handleErrorResponse(error);
          }
        );
      } else {
        this.productoService.createProducto(this.producto).subscribe(
          response => {
            console.log('Producto creado:', response);
            this.alertaService.showNotification('Producto creado', 'success');
            form.resetForm(); // Limpiar el formulario después de la creación
            this.handlePostSubmitActions();
          },
          error => {
            this.handleErrorResponse(error);
          }
        );
      }
    } else {
      console.log('Formulario inválido');
      this.errorMessage = 'El formulario no es válido. Por favor, revisa los datos ingresados.';
    }
  }
  
  handlePostSubmitActions() {
    this.productoService.getProductos().subscribe(
      productos => {
        this.productos = productos; // Actualiza la lista de productos en la vista
        this.router.navigate(['/productos']); // Redirige a la lista de productos
      },
      error => {
        console.error('Error al cargar los productos:', error);
        this.alertaService.showNotification('Error al cargar los productos', 'danger');
      }
    );
  }
  
  handleErrorResponse(error: any) {
    if (error.status === 400) {
      if (error.error.message.includes('Nombre del producto ya existe')) {
        this.errorMessage = 'Ya existe un producto con este nombre. Por favor, utiliza un nombre diferente.';
      } else if (error.error.message.includes('Código de barras ya está en uso')) {
        this.errorMessage = 'El código de barras ya está en uso. Por favor, utiliza un código diferente.';
      } else {
        this.errorMessage = 'Error: ' + error.error.message;
      }
    } else {
      this.errorMessage = 'Ha ocurrido un error inesperado.';
    }
    console.error('Error:', error);
  }
  
  editarProducto(producto: Producto) {
    this.producto = { ...producto };
    this.editando = true;
  }

  borrarProducto(id: number) {
    this.productoService.deleteProducto(id).subscribe(() => this.cargarProductos());
  }

  cancelarEdicion() {
    this.editando = false;
    this.producto = {
      id_Producto: 0,
      nombre: '',
      id_Categoria: 0,
      precio_Compra: 0,
      precio_Venta: 0,
      utilidad: 0,
      cantidad_Stock: 0,
      cant_Minima: 0,
      codigo_Barras: 0
    };
  }

  // Método para alternar el estado de los menús desplegables
  toggleDropdown(menu: string): void {
    // Cierra todos los menús desplegables
    Object.keys(this.dropdownOpen).forEach(key => {
      if (key !== menu) {
        this.dropdownOpen[key] = false;
      }
    });
    // Alterna el menú desplegable actual
    this.dropdownOpen[menu] = !this.dropdownOpen[menu];
  }
  searchProductos(): void {
    if (this.searchTerm.trim()) {
      this.filteredProductos = this.productos.filter(p => p.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()));
    } else {
      this.filteredProductos = this.productos; // RESTABLECER LA LISTA SI NO HAY TÉRMINO DE BÚSQUEDA
    }
  }
  logout() {
    this.loginService.logout();
  }
}
