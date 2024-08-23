import { Component,HostListener } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable'
import { LoginService } from './services/login/login.service';
import { AlertaService } from './services/alertas/alerta.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  alerta$ = this.alertaService.alerta$;
 title = 'client';
  constructor(private loginservice:LoginService, private alertaService:AlertaService){
  }
/*  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    const estadoCorte = localStorage.getItem('estadoCorte');
    if (estadoCorte && estadoCorte !== 'final') {
      $event.returnValue = 'Tienes un corte de caja pendiente. ¿Estás seguro de que quieres salir?';
    }
  }*/

 /* logout() {
    this.loginservice.logout();
  }*/


  generatePDF() {
    // Crear una nueva instancia de jsPDF
    const doc = new jsPDF();

    // Agregar texto al PDF
    doc.text('Hello world!', 10, 10);

    // Opcional: Agregar una tabla al PDF usando jsPDF-AutoTable
    (doc as any).autoTable({
      head: [['Column 1', 'Column 2', 'Column 3']],
      body: [
        ['Row 1, Col 1', 'Row 1, Col 2', 'Row 1, Col 3'],
        ['Row 2, Col 1', 'Row 2, Col 2', 'Row 2, Col 3'],
        // Agrega más filas según sea necesario
      ],
    });

    // Guardar el PDF con un nombre específico
    doc.save('sample.pdf');
  }


  }

  

