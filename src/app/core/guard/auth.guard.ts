import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SecurityUserService } from '../service/auth/security-user.service';
import { Observable } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private securityUserService: SecurityUserService,
              private router: Router,
              private oauthService: OAuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    let isUserLogged = this.securityUserService.isUserLogged();

    if (!isUserLogged) {
      this.oauthService.initLoginFlow();
      return false;
    }
    return true;
  }

}