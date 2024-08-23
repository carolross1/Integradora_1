import { Component,OnInit } from '@angular/core';
import { ActivatedRoute, Router } from'@angular/router';
import { FacturaService } from '../../../services/factura/factura.service';
import { Factura } from '../../../models/Factura';
import { LoginService } from '../../../services/login/login.service';

@Component({
  selector: 'app-factura-detail',
  templateUrl: './factura-detail.component.html',
  styleUrl: './factura-detail.component.css'
})
export class FacturaDetailComponent implements OnInit {

  factura: Factura | null = null;
   // Agrega una propiedad para manejar el estado de los menús desplegables
 dropdownOpen: { [key: string]: boolean } = {};

  constructor(private route: ActivatedRoute,
    private facturaService: FacturaService,
    private router: Router,
    private loginService:LoginService
  ) {}

  ngOnInit(): void {
    const id_Factura = Number(this.route.snapshot.paramMap.get('id'));
    if (id_Factura) {
      this.facturaService.getFacturaById(id_Factura).subscribe((data: Factura) => {
        this.factura = data;
      });
    }
  }

  volver(): void {
    this.router.navigate(['/facturas']);
  }
  toggleDropdown(key: string) {
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






