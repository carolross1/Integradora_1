import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ProductoComponent } from './producto/producto.component';
import { ProductoService } from '../../services/productos/producto.service';
import { RouterModule } from '@angular/router';
import { ListaCategoriasComponent } from './lista-categorias/lista-categorias.component';
import { CategoriaService } from '../../services/categoria/categoria.service';


@NgModule({
  declarations: [
    ProductoComponent,
    ListaCategoriasComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,

  ],
  providers: [ProductoService,CategoriaService], 
  exports: [
 ProductoComponent
  ]
})
export class ProductoModule { }
