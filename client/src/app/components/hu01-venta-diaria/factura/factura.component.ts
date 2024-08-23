import { Component,OnInit, ViewChild} from '@angular/core';
import { Factura } from '../../../models/Factura';
import { FacturaService } from '../../../services/factura/factura.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LoginService } from '../../../services/login/login.service';
import { Router,ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']  // Corregido: styleUrls en lugar de styleUrl
})
export class FacturaComponent implements OnInit {
  factura: Factura = {
    id_Venta: '',
    RFC: '',
    nombre: '',
    apellidos: '',
    estado: '',
    municipio: '',
    codigo_Postal: '',
    direccion: '',
    fecha_Factura: '',
    total: 0
  };
detallesVenta:any[]=[];
errorMessage=""
  dropdownOpen: { [key: string]: boolean } = {}; 
  isEditing: boolean = false; 

  constructor(private facturaService: FacturaService,
     private loginService:LoginService,
      private router:Router,
       private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditing = true;
        this.cargarFactura(Number(id));
      }
    });
  }
  cargarFactura(id: number): void {
    this.facturaService.getFacturaById(id).subscribe(
      (factura: Factura) => {
        this.factura = factura;
      },
      error => {
        console.error('Error al cargar la factura:', error);
      }
    );
  }

  onSubmit(form: NgForm) {

        if (this.isEditing) {
      // Si estamos editando, actualizamos la factura existente
      this.facturaService.updateFactura(this.factura).subscribe(
        response => {
          if (form.valid) {
            console.log('Formulario válido:', this.factura);

          console.log('Factura actualizada:', response);
        } else {

          console.log('Formulario inválido');
          return
        }
  
          // Obtener detalles de la venta después de actualizar la factura
          this.facturaService.getDetallesVenta(this.factura.id_Venta).subscribe(
            detalles => {
              this.detallesVenta = detalles;
              const totalVenta = this.detallesVenta.reduce((acc, detalle) => acc + detalle.total_venta, 0);
              this.factura.total = totalVenta;
              this.generarPDF(); 
              this.router.navigate(['/facturas']);
            },
            error => {
              console.error('Error al obtener los detalles de la venta:', error);
            }
          );
        },
        error => {
          console.error('Error al actualizar la factura:', error);
        }
      );
    } else {



      this.facturaService.createFactura(this.factura).subscribe(
        response => {
            if (form.valid) {
                console.log('Formulario válido:', this.factura);
                console.log('Factura creada:', response);
                this.handlePostSubmitActions();
            } else {
                console.log('Formulario inválido');
            }
        },
        error => {
            if (error.status === 400 && error.error.message.includes('Ya existe una factura para este ticket')) {
                this.errorMessage = '**Ya existe una factura para este ticket. Por favor, utiliza un ticket diferente**';
            } else {
                this.errorMessage = 'Error al crear la factura: ' + (error.error?.message || 'Ha ocurrido un error inesperado.');
            }
            console.error('Error al crear la factura:', error);
        }
    );
}
}
handlePostSubmitActions() {
  this.facturaService.getDetallesVenta(this.factura.id_Venta).subscribe(
      detalles => {
          this.detallesVenta = detalles;
          const totalVenta = this.detallesVenta.reduce((acc, detalle) => acc + detalle.total_venta, 0);
          this.factura.total = totalVenta;
          this.generarPDF(); // Generar el PDF después de crear la factura
          this.router.navigate(['/facturas']);
      },
      error => {
          console.error('Error al obtener los detalles de la venta:', error);
      }
  );
}

actualizarTotal() {
  if (this.factura.id_Venta) {
    this.facturaService.getTotalPorTicket(this.factura.id_Venta).subscribe(response => {
      this.factura.total = response.total;
    }, error => {
      console.error('Error al obtener el total por número de ticket:', error);
    });
  } else {
    this.factura.total = 0; // Resetea el total si no hay número de ticket
  }
}

  generarPDF() {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
  
    // Configura la tipografía y los márgenes
    doc.setFont('Helvetica');
    doc.setFontSize(12);
  
    // Agregar título y logo
    doc.setFontSize(16);
    doc.text(`Factura: #${this.factura.id_Factura}`, 95, 20);
  // Configuración de la fuente y tamaño para el contenido
  doc.setFontSize(12);
  doc.setFont('Helvetica', 'normal');

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Ejemplo de datos de la factura
  const facturaFecha = new Date(this.factura.fecha_Factura);
  
  // Agregar detalles de la factura
  doc.text(`Ticket: ${this.factura.id_Venta}`, 30, 40);
  doc.text(`RFC: ${this.factura.RFC}`, 130, 40);
  doc.text(`Nombre: ${this.factura.nombre}`, 30, 60);
  doc.text(`Apellido: ${this.factura.apellidos}`, 130, 60);
  doc.text(`Estado: ${this.factura.estado}`, 30, 80);
  doc.text(`Municipio: ${this.factura.municipio}`, 130, 80);
  doc.text(`Código Postal: ${this.factura.codigo_Postal}`, 30, 100);
  doc.text(`Dirección: ${this.factura.direccion}`, 130, 100);
   doc.text(`Fecha factura: ${formatDate(facturaFecha)}`, 30, 120);
  doc.text(`Total: $${this.factura.total}`, 130, 120);

    // Agregar tabla de detalles
    autoTable(doc, {
      startY: 150,
      head: [['ID Producto', 'Cantidad', 'Descuento', 'Total Venta']],
      body: this.detallesVenta.map(detalle => [
        detalle.id_Producto,
        detalle.cantidad,
        detalle.descuento,
        detalle.total_venta
      ]),
      theme: 'grid',
      headStyles: { 
        fillColor: [141, 94, 192], // Color de fondo en formato RGB
        textColor: [255, 255, 255], // Color del texto en formato RGB (blanco)
        fontSize: 12,
        fontStyle: 'bold'
      },
      styles: { 
        fontSize: 10, 
        cellPadding: 5, 
        overflow: 'linebreak'
      },
      columnStyles: { 
        0: { halign: 'center' }, 
        1: { halign: 'right' }, 
        2: { halign: 'right' }, 
        3: { halign: 'right' } 
      },
      margin: { top: 20 },
      didDrawPage: function (data) {
        // Agregar pie de página
        doc.setFontSize(22);
        doc.text('Gracias por su compra', 10, doc.internal.pageSize.height - 10);
      }
    });
  
    doc.save('factura.pdf');
}

  // Método para alternar el estado de los desplegables
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