import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoginService } from '../login/login.service';


@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private loginService: LoginService) {
    // Inicializar el usuario actual si está disponible
    this.initializeUser();
  }

  private initializeUser() {
    const user = this.loginService.getCurrentUser();
    this.currentUserSubject.next(user);
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user && user.tipo_Usuario === 'Admin';
  }

  // Puedes agregar más métodos según sea necesario
}