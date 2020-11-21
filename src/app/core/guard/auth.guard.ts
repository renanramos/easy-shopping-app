import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SecurityUserService } from '../service/auth/security-user.service';
import { Observable } from 'rxjs';
import { SnackbarService } from '../shared/service/snackbar.service';
import { ConstantMessages } from '../shared/constants/constant-messages';
import { AuthConfig, NullValidationHandler, OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  authConfig: AuthConfig = environment.authConfig;
  isUserLoggedIn: boolean = false;
  userLoggedName: string = '';
  
  constructor(private securityUserService: SecurityUserService,
              private router: Router,
              private snackBarService: SnackbarService,
              private oauthService: OAuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    let isUserLogged = this.securityUserService.isUserLogged();

    if (!isUserLogged) {
      this.configureOAuthProperties();
      this.oauthService.initLoginFlow();
      return false;
    }
    return true;
  }

  async configureOAuthProperties() {
    this.oauthService.configure(this.authConfig);
    this.oauthService.tokenValidationHandler = new NullValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
    this.oauthService.events.subscribe(({ type }: OAuthEvent) => {
      switch (type) {
        case 'token_received':
          this.securityUserService.setUserPropertiesFromToken();
          this.isUserLoggedIn = this.securityUserService.isUserLogged();
          this.userLoggedName = this.securityUserService.userLoggedUsername ? this.securityUserService.userLoggedUsername : "";
          window.location.reload();
          break;
        }
    });
  }
}