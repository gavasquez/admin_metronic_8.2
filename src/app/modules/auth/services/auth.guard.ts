import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard  {
  constructor(private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(!this.authService.user || !this.authService.token){
      this.authService.logout();
      return false;
    }
    let token = this.authService.token;
    //* Descodifica una cadena de datos atob y con el split lo cortamos por el punto y obtenemos la primera posicion
    let expiration = (JSON.parse(atob(token.split(".")[1]))).exp;
    //* Token ha expirado
    if(Math.floor((new Date().getTime()/1000)) >= expiration){
      this.authService.logout();
      return false;
    }
    return true;
  }
}
