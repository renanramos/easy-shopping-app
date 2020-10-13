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

@Injectable()
export class HttpIntercept implements HttpInterceptor {

  constructor(
    private oauthService: OAuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {   
    let headers = new HttpHeaders();

    headers.set('Authorization', `Bearer ${this.oauthService.getAccessToken()}`);

    const authReq = req.clone({
      headers: headers
    });

    const sendRequest = {
      next: () => {},
      error: (error) => {
        console.log(error);
      }
    };

    return next.handle(authReq)
      .pipe(tap(sendRequest));
  }
}