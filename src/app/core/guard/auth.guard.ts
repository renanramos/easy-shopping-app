import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SecurityUserService } from '../service/auth/security-user.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private securityUserService: SecurityUserService,
              private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    let isUserLogged = this.securityUserService.isUserLogged();

    if (!isUserLogged) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }

}