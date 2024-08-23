import { Component, OnInit } from '@angular/core';
import { ProveedoresService } from '../../../services/Proveedores/proveedores-list.service';
import { Proveedor } from '../../../models/Proveedores-list';
import { LoginService } from '../../../services/login/login.service';
import { FormsModule } from '@angular/forms'; // Importar FormsModule

@Component({
  selector: 'app-proveedores-list',
  templateUrl: './proveedores-list.component.html',
  styleUrls: ['./proveedores-list.component.css']
})
export class ListaProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = [];
  nombreProveedor: string = '';
  apellidoProveedor: string = '';
  emailProveedor: string = '';
  empresaProveedor: string = '';
  searchTerm: string = '';
  dropdownOpen: { [key: string]: boolean } = {};

  isEmailValid: boolean = true; // Variable para la validación del email
  isNombreValid: boolean = true; // Variable para la validación del nombre
  isApellidoValid: boolean = true; // Variable para la validación del apellido
  isEmpresaValid: boolean = true; // Variable para la validación de la empresa

  constructor(private proveedorService: ProveedoresService, private loginService: LoginService) {}

  ngOnInit(): void {
    this.getProveedores();
  }

  getProveedores(): void {
    this.proveedorService.getProveedores().subscribe(proveedores => {
      this.proveedores = proveedores;
    });
  }

  validateFields(): boolean {
    // Validar que los campos no contengan números y que el email tenga formato válido
    const namePattern = /^[^0-9]*$/; // No permitir números
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Formato de email válido

    this.isNombreValid = namePattern.test(this.nombreProveedor);
    this.isApellidoValid = namePattern.test(this.apellidoProveedor);
    this.isEmpresaValid = namePattern.test(this.empresaProveedor);
    this.isEmailValid = emailPattern.test(this.emailProveedor);

    return this.isNombreValid && this.isApellidoValid && this.isEmpresaValid && this.isEmailValid;
  }

  isFormValid(): boolean {
    return this.validateFields(); // Validar los campos
  }

  addProveedor(): void {
    if (this.isFormValid()) { // Llamar a la validación antes de agregar
      if (this.nombreProveedor.trim() && this.apellidoProveedor.trim() && this.emailProveedor.trim() && this.empresaProveedor.trim()) {
        const newProveedor: Omit<Proveedor, 'id_Proveedor'> = {
          nombre: this.nombreProveedor,
          apellidos: this.apellidoProveedor,
          email: this.emailProveedor,
          empresa: this.empresaProveedor,
          editing: false // Asignar false como valor por defecto
        };
        this.proveedorService.addProveedor(newProveedor).subscribe(
          () => {
            this.getProveedores(); // Volver a obtener la lista actualizada
            this.resetForm(); // Limpiar los campos de entrada
          },
          error => {
            console.error('Error al agregar al proveedor', error);
          }
        );
      } else {
        console.error('Todos los campos son obligatorios.');
      }
    } else {
      console.error('Hay errores en los campos del formulario.');
    }
  }

  resetForm(): void {
    this.nombreProveedor = '';
    this.apellidoProveedor = '';
    this.emailProveedor = '';
    this.empresaProveedor = '';
    this.isNombreValid = true;
    this.isApellidoValid = true;
    this.isEmpresaValid = true;
    this.isEmailValid = true;
  }

  searchProveedores(): void {
    if (this.searchTerm.trim()) {
      this.proveedores = this.proveedores.filter(c => c.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()));
    } else {
      this.getProveedores(); // Restablecer la lista si no hay término de búsqueda
    }
  }

  deleteProveedor(idProveedor: number): void { // Cambia el tipo a `number`
    this.proveedorService.deleteProveedor(idProveedor).subscribe(() => {
      this.getProveedores(); // Volver a obtener la lista actualizada
    });
  }

  editProveedor(proveedor: Proveedor): void {
    proveedor.editing = true;
  }

  saveProveedor(proveedor: Proveedor): void {
    proveedor.editing = false;
    this.proveedorService.updateProveedor(proveedor.id_Proveedor, proveedor).subscribe(() => {
      this.getProveedores(); // Volver a obtener la lista actualizada
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
