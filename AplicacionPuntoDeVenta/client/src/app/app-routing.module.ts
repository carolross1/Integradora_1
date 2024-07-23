import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorteCajaComponent } from './components/hu03-corte-caja/corte-caja/corte-caja.component';
import { InventarioComponent } from './components/hu05-inventario/inventario/inventario.component';
import { NotificacionesComponent } from './components/hu07-notificacion/notificaciones/notificaciones.component';
import { MenuComponent } from './components/menu/menu.component';
import { PrincipalVentasComponent } from './components/hu01-venta-diaria/principal-ventas/principal-ventas.component';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { InventariosFrecuentesComponent } from './components/hu05-inventario/inventarios-frecuentes/inventarios-frecuentes.component';
import { EntregasProveedorComponent } from './components/hu02-proveedores/entregas-proveedor/entregas-proveedor.component';
import { LoginComponent } from './components/login/login.component';
import { PedidosAProveedorComponent } from './components/hu02-proveedores/pedidos-a-proveedor/pedidos-a-proveedor.component';
import { ProveedorFormComponent } from './components/hu02-proveedores/proveedores/proveedores.component';
import { CancelarPedidoComponent } from './components/hu02-proveedores/cancelar-pedido/cancelar-pedido.component';
import { ReportesComponent } from './components/hu04-reportes/reportes/reportes.component';
import { ClientesFrecuentesComponent } from './components/hu06-cliente-frecuente/clientes-frecuentes/clientes-frecuentes.component';
import { ListaClientesFrecuentesComponent } from './components/hu06-cliente-frecuente/lista-clientes-frecuentes/lista-clientes-frecuentes.component'; 
import { ProveedoresListComponent } from './components/hu02-proveedores/proveedores-list/proveedores-list.component';
import { FacturaComponent } from './components/hu01-venta-diaria/factura/factura.component';
import { DescuentoComponent } from './components/hu01-venta-diaria/descuento/descuento.component';
import { NUsuarioComponent } from './components/login/login-nuevos-usuarios/nusuario.component';


const routes: Routes = [
  {
    path:'',
    redirectTo:'/login',
    pathMatch:'full'
  },
  {
    path:'principal',
    component:PrincipalVentasComponent
  },
  {
    path:'menu', 
    component:MenuComponent
  },
  { path: 'inventarios', 
    component: InventarioComponent, 
  },
  { path: 'inventariofrecuente', 
    component: InventariosFrecuentesComponent, 
  },
  {
    path:'notificacion', 
    component:NotificacionesComponent
  },
  {
    path:'cortedecaja',
    component:CorteCajaComponent,
  },
  {
    path:'entregasproveedor', 
    component:EntregasProveedorComponent
  },
  {
    path:'login', 
    component:LoginComponent
  },
  {
    path:'pedidosaproveedor', 
    component:PedidosAProveedorComponent
  },
  {
    path:'proveedores/add', 
    component:ProveedorFormComponent
  },
  {
    path:'proveedores', 
    component:ProveedoresListComponent
  },
  {
    path:'proveedores/edit/:id_Proveedor', 
    component:ProveedoresListComponent
  },
  {
    path:'cancelarpedido', 
    component:CancelarPedidoComponent
  }, 
  {
    path:'reportes', 
    component:ReportesComponent
  },
  {
    path:'clientesfrecuentes', 
    component:ClientesFrecuentesComponent
  },
  {
    path:'listaclientesf', 
    component:ListaClientesFrecuentesComponent
  }, 
  {
    path:'formulariofactura', 
    component:FacturaComponent
  },

  {
    path:'gestiondescuento',
    component:DescuentoComponent
  },
    { 
      path: 'login-nuevos-usuarios',
       component:NUsuarioComponent
       }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
