import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancelarPedidoComponent } from '../cancelar-pedido/cancelar-pedido.component';
import { EntregasProveedorComponent } from '../entregas-proveedor/entregas-proveedor.component';
import { PedidosProveedorComponent } from '../pedidos-a-proveedor/pedidos-a-proveedor.component';
import { ListaProveedoresComponent } from '../proveedores-list/proveedores-list.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
CancelarPedidoComponent,
PedidosProveedorComponent,
EntregasProveedorComponent,
ListaProveedoresComponent,
EntregasProveedorComponent,

  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    CancelarPedidoComponent,
    PedidosProveedorComponent,
ListaProveedoresComponent,
EntregasProveedorComponent,

  ]
})
export class Hu02ProveedoresModule { }
