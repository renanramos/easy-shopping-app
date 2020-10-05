import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse, HttpXsrfTokenExtractor } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { SnackbarService } from '../shared/service/snackbar.service';
import { SecurityUserService } from '../service/auth/security-user.service';
import { UtilsService } from '../shared/utils/utils.service';
import { KeycloakService } from 'keycloak-angular';
import { switchMap, tap } from 'rxjs/operators';
import { from, pipe } from 'rxjs';

@Injectable()
export class HttpIntercept implements HttpInterceptor {

  constructor(
    private keycloakService: KeycloakService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.keycloakService.addTokenToHeader())
      .pipe(
        switchMap(response => {
          const authReq = req.clone({
            headers: response
          });
          return next.handle(authReq);
        }));
  }
}