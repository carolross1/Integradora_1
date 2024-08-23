import { Component, EventEmitter, OnInit, Output  } from '@angular/core';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { Usuario } from '../../../models/Usuario';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../../services/login/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.css'
})
export class ListaUsuariosComponent implements OnInit {
  //@Output() edit = new EventEmitter<Usuario>();
  Usuario: Usuario[] = [];
 /* searchId: string = '';*/

  constructor(private usuarioService: UsuarioService,private router:Router,
    private loginService:LoginService
  ) {}
  public dropdownOpen: { [key: string]: boolean } = {}; // Estado de los desplegables
  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.usuarioService.getUsers().subscribe(users => {
      this.Usuario = users;
    });
  }
 /* searchUser(): void {
    if (this.searchId.trim() === '') {
      this.getUsers();
    } else {
      this.usuarioService.getUser(this.searchId).subscribe(user => {
        this.Usuario = user ? [user] : [];
      });
    }
  }*/
    editUser(id: string): void {
      this.router.navigate(['/usuario/editar',id]) 
    } 
    deleteUser(id: string): void {
      console.log(id)
      Swal.fire({
        title: '¿Estás seguro de que deseas eliminar este usuario?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.usuarioService.deleteUser(id).subscribe(
            () => {
              Swal.fire(
                '¡Eliminado!',
                'El usuario ha sido eliminado exitosamente.',
                'success'
              );
              this.getUsers();
            },
            (error: any) => {
              // Manejo de errores específicos
              const errorMessage = error.error?.message || 'Ocurrió un error al eliminar el usuario.';
              Swal.fire(
                'Error',
                errorMessage,
                'error'
              );
            }
          );
        }
      });
    }
  addUser(): void {
    this.router.navigate(['/usuario']); 
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
