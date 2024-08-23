import { Component } from '@angular/core';
import { ReporteService } from '../../../services/reportes/reportes.service';
import { Reportes } from '../../../models/Reportes';
import { LoginService } from '../../../services/login/login.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent {
  fechaDesde: string='';
  fechaHasta: string='';
  reportes: Reportes[] = [];
  totalGanancias: number=0; 

  constructor(private reportesService: ReporteService, private loginService:LoginService) {}
  
  dropdownOpen: { [key: string]: boolean } = {}; // Estado de los menús desplegables
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


  obtenerReportes(fechaDesde: string, fechaHasta: string): void {
    this.reportesService.obtenerReporte(fechaDesde, fechaHasta).subscribe(
      data => {
        this.reportes = data;
        console.log('Reportes obtenidos:', this.reportes);
        this.calcularTotalGanancias();
      },
      error => {
        // Mostrar un mensaje más específico al usuario
        const errorMessage = error.error?.error || 'Ocurrió un error al obtener los reportes.';
        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error'
        });
        console.error('Error obteniendo reportes:', error);
      }
    );
  }

calcularTotalGanancias() {
  this.totalGanancias = this.reportes.reduce((sum, reporte) => sum + reporte.ganancias, 0);
}
logout() {
  this.loginService.logout();
}
}