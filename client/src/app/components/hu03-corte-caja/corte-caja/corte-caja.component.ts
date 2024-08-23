import { Component, OnInit } from '@angular/core';
import { CorteCajaService } from '../../../services/corte-caja/corte-caja.service';
import { CorteCaja } from '../../../models/CorteCaja';
import { LoginService } from '../../../services/login/login.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertaService } from '../../../services/alertas/alerta.service';


@Component({
  selector: 'app-corte-caja',
  templateUrl: './corte-caja.component.html',
  styleUrls: ['./corte-caja.component.css']
})
export class CorteCajaComponent implements OnInit {
    corte: any[] = [];

  corteActual: CorteCaja = {
    id_Corte: 0,
    fecha: '',
    hora_Inicio: '',
    hora_Fin:'',
    saldo_Inicial: 0,
    ingresos: 0,
    egresos: 0,
    saldo_Final: 0,
    id_Usuario: ''
  };
  saldo_Inicial: number = 0;
  saldo_Final: number = 0;
  id_Usuario: string = '';
  fecha= '';
  hora_Inicio='';
  showCorteDetails: boolean = false;
  isCorteAbierto: boolean = false;  // Nueva propiedad

  public dropdownOpen: { [key: string]: boolean } = {}; // Estado de los desplegables

  constructor(private corteCajaService: CorteCajaService, 
    private loginService: LoginService,
    private router:Router,
  private alertaService:AlertaService) { }

  ngOnInit(): void {
    this.fecha= new Date().toISOString().split('T')[0];
    this.hora_Inicio= new Date().toTimeString().split(' ')[0];
    const currentUser = this.loginService.getCurrentUser();
    this.id_Usuario= currentUser.id_Usuario;
    console.log('Usuario actual:', currentUser);
      // Verificar si hay un corte abierto al inicializar el componente
      this.corteCajaService.obtenerCorteAbierto(this.id_Usuario).subscribe(
        response => {
          if (response && response.id_Corte) {
            this.isCorteAbierto = true; // Hay un corte abierto
          } else {
            this.isCorteAbierto = false; // No hay corte abierto
          }
        },
        (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.isCorteAbierto = false; // No hay corte abierto
          } else {
            console.error('Error al verificar el corte abierto:', error);
            this.alertaService.showNotification('Error al verificar el corte abierto.', 'error');
          }
        }
      );

  }

  iniciarCorte(): void {
    const id_Usuario = this.id_Usuario;
    console.log('Este es el usuario:', id_Usuario);

    // Verificar si ya existe un corte abierto para este usuario
    this.corteCajaService.obtenerCorteAbierto(id_Usuario).subscribe(
        response => {
         
            if (response && response.id_Corte) {
                // Si hay un corte abierto, mostrar un mensaje
               this.alertaService.showNotification('Ya tienes un corte de caja abierto. Debes cerrarlo antes de iniciar uno nuevo.','error')
            } else {
                // Si no hay cortes abiertos, proceder con el inicio de un nuevo corte
                console.log('No hay cortes abiertos, iniciando nuevo corte.');

                const data = {
                    fecha: this.fecha,
                    hora_Inicio: this.hora_Inicio,
                    saldo_Inicial: this.saldo_Inicial,
                    id_Usuario: this.id_Usuario
                };

                this.corteCajaService.iniciarCorte(data).subscribe(
                    response => {
                        if (response.success) {
                          this.alertaService.showNotification('Corte inicial realizado con éxito.','success')
                            this.router.navigate(['/principal']);
                        } else {
                          this.alertaService.showNotification('Corte inicial realizado con éxito.','success')
                            this.router.navigate(['/principal']);
                        }
                    },
                    (error: HttpErrorResponse) => {
                        console.error('Error al realizar el corte inicial:', error);
                       this.alertaService.showNotification('Error al realizar el corte inicial.','error')
                    
                    }
                );
            }
        },
        (error: HttpErrorResponse) => {
            if (error.status === 404) {
                // Si obtenemos un 404, tratamos esto como la ausencia de un corte abierto
                console.log('No hay corte abierto para el usuario. Procediendo con el nuevo corte.');

                const data = {
                    fecha: this.fecha,
                    hora_Inicio: this.hora_Inicio,
                    saldo_Inicial: this.saldo_Inicial,
                    id_Usuario: this.id_Usuario
                };

                this.corteCajaService.iniciarCorte(data).subscribe(
                    response => {
                        if (response.success) {
                            //alert('Corte inicial realizado con éxito');
                            //this.router.navigate(['/principal']);
                        } else {
                          this.alertaService.showNotification('Corte inicial realizado con éxito.','success')
                          this.router.navigate(['/principal']);
                        }
                    },
                    (error: HttpErrorResponse) => {
                        console.error('Error al realizar el corte inicial:', error);
                        this.alertaService.showNotification('Error al realizar el corte inicial.','error')
                  
                    }
                );
            } else {
                // Manejo de otros errores
                console.error('Error al verificar el corte abierto:', error);
                alert('Ocurrió un error al verificar si hay un corte abierto. Error: ' + (error.message || error));
            }
        }
    );
    if (this.saldo_Inicial === null || this.saldo_Inicial === undefined || this.saldo_Inicial < 0) {
      // Manejo de errores o lógica adicional si es necesario
      return;
    }
}
    cerrarUltimoCorte() {
        const id_Usuario = this.id_Usuario;
        console.log('ES EL ID CORRECTO',id_Usuario);

        this.corteCajaService.obtenerCorteAbierto(id_Usuario).subscribe(
            response => {
                const id_Corte = response.id_Corte;
    
                // Ahora, enviar el id_Corte para cerrar el corte
                this.corteCajaService.cerrarCorte({ id_Corte }).subscribe(
                    response => {
                        if (response.success) {
                          this.alertaService.showNotification('Corte cerrado con éxito','success')
                         
                        } else {
                          this.alertaService.showNotification('Corte cerrado con éxito','success')
                            this.obtenerCorteActual();
                        }
                    },
                    error => {
                        console.error('Error al cerrar el corte:', error);
                        this.alertaService.showNotification('Error al cerrar el corte.','error');
                    }
                );
            },
            error => {
                console.error('Error al obtener el corte abierto:', error);
                this.alertaService.showNotification('Error al cerrar el corte.','error');
            }
        );
    }
    
    obtenerCorteActual(): void {
        this.corteCajaService.obtenerCorteActual().subscribe(
          data => {
            this.corteActual = data;
            console.log('Corte actual obtenido:', this.corteActual);
            this.showCorteDetails = true;
          },
          error => {
            console.error('Error al obtener el corte actual:', error);
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
  closeReport() {
    this.showCorteDetails = false; // Ocultar el reporte de ventas
   
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      this.router.navigate(['/login']);
   
}
}