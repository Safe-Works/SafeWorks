import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Data, Router, RouterStateSnapshot } from '@angular/router';
import { UserAuth } from './User.Auth';

interface RouteData extends Data {
  canActivateLogin?: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  
  constructor(private userAuth: UserAuth, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.userAuth.authUserFromToken();
  
    const routeData = route.data as RouteData;
  
    if (routeData.canActivateLogin && this.userAuth.currentUser) {
      // Usuário autenticado, redirecionar para a página inicial ou qualquer outra lógica desejada
      this.router.navigate(['/']);
      return false;
    }
  
    if (!routeData.canActivateLogin && !this.userAuth.currentUser) {
      // Usuário não autenticado, redirecionar para a tela de login
      this.router.navigate(['/login']);
      return false;
    }
  
    // Restante da lógica, se necessário, para permitir ou negar o acesso
    return true;
  }
  
  canActivateLogin(): boolean {
    this.userAuth.authUserFromToken();
    if (this.userAuth.currentUser) {
      return false;
    } else {
      this.router.navigate(['/jobs']);
      return true;
    }
  }
}
