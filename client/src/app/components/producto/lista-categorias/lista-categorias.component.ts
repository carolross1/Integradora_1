import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../../../services/categoria/categoria.service';
import { Categoria } from '../../../models/Categoria';
import { LoginService } from '../../../services/login/login.service';

@Component({
  selector: 'app-lista-categorias',
  templateUrl: './lista-categorias.component.html',
  styleUrls: ['./lista-categorias.component.css']
})
export class ListaCategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  nombreCategoria: string = '';
  searchTerm: string = '';
  dropdownOpen: { [key: string]: boolean } = {};
  errorMessage: string | undefined;

  constructor(private categoriaService: CategoriaService,private loginService:LoginService) {}

  ngOnInit(): void {
    this.getCategorias();
  }

  getCategorias(): void {
    this.categoriaService.getCategorias().subscribe(categorias => {
      this.categorias = categorias;
    });
  }

  addCategoria(): void {
    this.errorMessage = '';
    if (this.nombreCategoria.trim()) {
      const newCategoria: Categoria = { nombre: this.nombreCategoria };
      this.categoriaService.addCategoria(newCategoria).subscribe(
        () => {
          this.getCategorias(); 
          this.nombreCategoria = ''; 
        },
        error => {
          if (error.status === 500) { 
            this.errorMessage = 'La categoría ya existe, ingresa otro nombre';
          } else {
            console.error('Error al agregar categoría', error);
          }
        }
      );
    } else {
      console.error('El nombre de la categoría no puede estar vacío.');
    }
  }


  searchCategorias(): void {
    if (this.searchTerm.trim()) {
      this.categorias = this.categorias.filter(c => c.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()));
    } else {
      this.getCategorias(); // Restablecer la lista si no hay término de búsqueda
    }
  }

  deleteCategoria(idCategoria: number): void {
    this.categoriaService.deleteCategoria(idCategoria).subscribe(() => {
      this.getCategorias(); // Volver a obtener la lista actualizada
    });
  }

  editCategoria(categoria: Categoria): void {
    categoria.editing = true;
  }

  saveCategoria(categoria: Categoria): void {
    categoria.editing = false;
    this.categoriaService.updateCategoria(categoria).subscribe(updatedCategoria => {
      this.getCategorias(); // Volver a obtener la lista actualizada
    });
  }

  toggleDropdown(menu: string): void {
    // Cerrar cualquier otro desplegable abierto
    for (let key in this.dropdownOpen) {
      if (key !== menu) {
        this.dropdownOpen[key] = false;
      }
    }
    // Alternar el estado del desplegable actual
    this.dropdownOpen[menu] = !this.dropdownOpen[menu];
  }
  logout() {
    this.loginService.logout();
  }
}
