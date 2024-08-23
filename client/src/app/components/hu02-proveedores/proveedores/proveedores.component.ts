import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProveedoresService } from '../../../services/Proveedores/proveedores-list.service';
import { Proveedor } from '../../../models/Proveedores-list';
import { LoginService } from '../../../services/login/login.service';


@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ListaProveedoresComponent implements OnInit {
  mensaje: string = "EN MANTENIMIENTO, VUELVA PRONTOO!!";

 // Agrega una propiedad para manejar el estado de los menús desplegables
 dropdownOpen: { [key: string]: boolean } = {};
  constructor(
    private proveedoresService: ProveedoresService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loginService:LoginService
  ) {}


  ngOnInit(): void {
    // Aquí puedes inicializar datos si es necesario
  }
  logout() {
    this.loginService.logout();
  }
}
