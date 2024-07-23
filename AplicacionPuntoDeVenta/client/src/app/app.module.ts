import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule} from '@angular/common/http';
import { Hu01VentaDiariaModule } from './components/hu01-venta-diaria/hu01-venta-diaria/hu01-venta-diaria.module';
import { Hu02ProveedoresModule } from './components/hu02-proveedores/hu02-proveedores/hu02-proveedores.module';
import { Hu03CorteCajaModule } from './components/hu03-corte-caja/hu03-corte-caja/hu03-corte-caja.module';
import { Hu04ReportesModule } from './components/hu04-reportes/hu04-reportes/hu04-reportes.module';
import { Hu05InventarioModule } from './components/hu05-inventario/hu05-inventario/hu05-inventario.module';
import { Hu06ClienteFrecuenteModule } from './components/hu06-cliente-frecuente/hu06-cliente-frecuente/hu06-cliente-frecuente.module';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { Hu07NotificacionModule } from './components/hu07-notificacion/hu07-notificacion/hu07-notificacion.module';
import { ProveedoresService } from './services/proveedores.service';
import { NUsuarioComponent } from './components/login/login-nuevos-usuarios/nusuario.component';
@NgModule({
  declarations: [
    AppComponent,
   MenuComponent,
   LoginComponent,
   NUsuarioComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    Hu01VentaDiariaModule,
    Hu02ProveedoresModule,
    Hu03CorteCajaModule,
    Hu04ReportesModule,
    Hu05InventarioModule,
    Hu06ClienteFrecuenteModule,
    Hu07NotificacionModule,
  ],
  providers: [ProveedoresService],
  bootstrap: [AppComponent]
})
export class AppModule { }
