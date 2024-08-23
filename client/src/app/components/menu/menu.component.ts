import { Component } from '@angular/core';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  

  isMenuVisible:boolean=false;

  toggleMenu(){
    this.isMenuVisible=!this.isMenuVisible;
  }

}
