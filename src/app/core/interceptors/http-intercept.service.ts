import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { SnackbarService } from '../shared/service/snackbar.service';

@Injectable()
export class HttpIntercept implements HttpInterceptor {

  constructor(
    private router: Router,
    private snackBarService: SnackbarService,
    private oauthService: OAuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {   

    const token = this.gettingAccessTokenFromOauthService();

    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });

      const sendRequest = {
        next: () => {},
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.snackBarService.openSnackBar(error.message, 'close');
            this.router.navigateByUrl('/');
          }
          this.snackBarService.openSnackBar(error.message, 'close');
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