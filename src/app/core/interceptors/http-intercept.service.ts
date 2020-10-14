import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse, HttpXsrfTokenExtractor } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { SnackbarService } from '../shared/service/snackbar.service';
import { SecurityUserService } from '../service/auth/security-user.service';
import { UtilsService } from '../shared/utils/utils.service';
import { KeycloakService } from 'keycloak-angular';
import { switchMap, tap } from 'rxjs/operators';
import { from, pipe } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

@Injectable()
export class HttpIntercept implements HttpInterceptor {

  constructor(
    private router: Router,
    private oauthService: OAuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {   

    const token = this.gettingAccessTokenFromOauthService();

    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });

      const sendRequest = {
        next: () => {},
        error: (error) => {
          console.log(error);
          if (error) {
            this.oauthService.logOut();
            this.router.navigateByUrl('/');
          }
        }
      }; 

      return next.handle(authReq)
        .pipe(tap(sendRequest));
    }

    return next.handle(req);
  }

  gettingAccessTokenFromOauthService() {
    return this.oauthService.getAccessToken() ? 
            this.oauthService.getAccessToken() :
            null;
  }
}