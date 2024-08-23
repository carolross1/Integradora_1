import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarioComponent } from '../inventario/inventario.component';
import { InventariosFrecuentesComponent } from '../inventarios-frecuentes/inventarios-frecuentes.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [InventarioComponent, InventariosFrecuentesComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ], 
  exports:[InventarioComponent, InventariosFrecuentesComponent]
})
export class Hu05InventarioModule { }
