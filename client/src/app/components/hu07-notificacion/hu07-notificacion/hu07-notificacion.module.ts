import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductoModule } from '../../producto/producto.module';
import { NotificacionesComponent } from '../notificaciones/notificaciones.component';
@NgModule({
  declarations: [NotificacionesComponent],
  imports: [
    CommonModule,
    RouterModule,
    ProductoModule
  ],
  exports: [NotificacionesComponent]
})
export class Hu07NotificacionModule { }
