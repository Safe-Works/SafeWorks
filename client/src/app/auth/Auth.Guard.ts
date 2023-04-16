import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserAuth } from './User.Auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userAuth: UserAuth, private router: Router) { }

  canActivate(): boolean {
    if (this.userAuth.currentUser) {
      // Usuário autenticado, permitir acesso
      return true;
    } else {
      // Usuário não autenticado, redirecionar para a tela de login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
