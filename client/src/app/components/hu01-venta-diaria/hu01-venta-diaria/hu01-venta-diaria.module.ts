import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PrincipalVentasComponent } from '../principal-ventas/principal-ventas.component';
import { RouterModule } from '@angular/router';
import { FacturaComponent } from '../factura/factura.component';
import { Hu07NotificacionModule } from '../../hu07-notificacion/hu07-notificacion/hu07-notificacion.module';


@NgModule({
  declarations: [   
    PrincipalVentasComponent,FacturaComponent],

  imports: [
    CommonModule,
    RouterModule,
    Hu07NotificacionModule,
    FormsModule,
  ],
  exports: [
   PrincipalVentasComponent, FacturaComponent
  ]
})
export class Hu01VentaDiariaModule { }
