import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse, HttpXsrfTokenExtractor } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { SnackbarService } from '../shared/service/snackbar.service';
import { SecurityUserService } from '../service/auth/security-user.service';
import { UtilsService } from '../shared/utils/utils.service';
import { KeycloakService } from 'keycloak-angular';

@Injectable()
export class HttpIntercept implements HttpInterceptor {

  authToken: string;

  constructor(
    private keycloakService: KeycloakService,
    private tokenExtractor: HttpXsrfTokenExtractor,
    private securityUserService: SecurityUserService,
    private utilsService: UtilsService,
    private snackBar: SnackbarService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = new HttpHeaders();
    this.getTokenFormService();

    if (req.url.indexOf('/assets/') < 0) {
      if (this.securityUserService.idUserLoggedIn) {
        headers = headers.set('Authorization', `Bearer ${this.authToken}`);
      }
    }

    const authReq = req.clone({
      headers: headers
    });

    return next.handle(authReq);
  }

  async getTokenFormService() {
    await this.keycloakService.getToken()
      .then((token) => {
        this.authToken = token;
      })
      .catch(() => this.authToken = '');
  }

  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   let headers = new HttpHeaders();

  //   if (req.url.indexOf('/assets/') < 0) {
  //     if (!!this.securityUserService.isUserLogged()) {
  //       const token = this.securityUserService.getUserLoggedToken();
  //       headers = headers.set('Authorization', `Bearer ${token}`);
  //     }
  //   }

  //   const authReq = req.clone({
  //     headers: headers
  //   });

  //   const sendRequest = {
  //     next: () => {},
  //     error: (error: any) => {
  //       if (error instanceof HttpErrorResponse) {
  //         if (error.status === 401) {
  //           this.securityUserService.deleteCookieAndRedirect();
  //           const errorMessage = this.utilsService.handleErrorMessage(error);
  //           this.snackBar.openSnackBar(errorMessage, 'close');
  //         }
  //         if (error.status === 0) {
  //           this.securityUserService.deleteCookieAndRedirect();
  //         }
  //       }
  //     }
  //   }

  //   return next.handle(authReq)
  //     .pipe(tap(sendRequest));
  // }
}