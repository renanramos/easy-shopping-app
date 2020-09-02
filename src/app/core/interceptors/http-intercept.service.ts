import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';
import { SnackbarService } from '../shared/service/snackbar.service';
import { SecurityUserService } from '../service/auth/security-user.service';

@Injectable()
export class HttpIntercept implements HttpInterceptor {

  constructor(
    private securityUserService: SecurityUserService,
    private router: Router,
    private snackBar: SnackbarService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = new HttpHeaders();

    if (req.url.indexOf('/assests/') < 0) {
      if (!!this.securityUserService.isUserLogged()) {
        const token = !!this.securityUserService.isUserLogged() ? this.securityUserService.getUserLoggedToken() : null;
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    const authReq = req.clone({
      headers: headers
    });

    const sendRequest = {
      next: () => {},
      error: (error: any) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            this.router.navigate(['/']);
            this.snackBar.openSnackBar('Usuário não autenticado. Favor realizar login para acessar esta página', 'close');
          }
        }
      }
    }

    return next.handle(authReq)
      .pipe(tap(sendRequest));
  }
}