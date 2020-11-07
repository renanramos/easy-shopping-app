import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { concatMap, delay, last, retryWhen, take, tap } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { SnackbarService } from '../shared/service/snackbar.service';
import { ConstantMessages } from '../shared/constants/constant-messages';
import { iif, throwError } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { InterceptValues } from '../shared/constants/intercept-values';

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
          if (error.status === InterceptValues.UNAUTHORIZED_STATUS_CODE) {
            this.snackBarService.openSnackBar(ConstantMessages.UNAUTHORIZED_USER, 'close');
            this.router.navigateByUrl('/');
          }
          this.snackBarService.openSnackBar(error.message, 'close');
        }
      }; 

      return next.handle(authReq)
        .pipe(tap(sendRequest));
    }

    const commonReq = {
      next: () => {},
      error: () => this.snackBarService.openSnackBar(ConstantMessages.AUTH_SERVER_ERROR, 'close')
    }

    return next.handle(req)
      .pipe(retryWhen(errors => errors.pipe(concatMap((error, attempt) =>
              iif(() => attempt >= InterceptValues.MAX_RETRY, 
                  throwError(error).pipe(tap(commonReq)), 
                  of(error).pipe(delay(InterceptValues.RESPONSE_TIMEOUT)))
            )
          )
        )
      );
  }

  gettingAccessTokenFromOauthService() {
    return this.oauthService.getAccessToken() ? 
            this.oauthService.getAccessToken() :
            null;
  }
}