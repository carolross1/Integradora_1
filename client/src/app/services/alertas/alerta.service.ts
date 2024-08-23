import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertaService {

  private alertaSubject = new BehaviorSubject<{ message?: string; type?: string | null } | null>(null);
  alerta$ = this.alertaSubject.asObservable();

  
  showNotification(message: string, type: string = 'success') {
    this.alertaSubject.next({message,type});
    setTimeout(() => {
      this.alertaSubject.next(null);
    }, 3000); 
  }
}
