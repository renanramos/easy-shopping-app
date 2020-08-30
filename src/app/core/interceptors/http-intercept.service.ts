import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpIntercept implements HttpInterceptor {

  constructor(
    private cookieService: CookieService,
    private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = new HttpHeaders();

    if (req.url.indexOf('/assests/') < 0) {
      if (!!localStorage.getItem('token')) {
        const token = !!localStorage.getItem('token') ? localStorage.getItem('token') : null;
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    const authReq = req.clone({
      headers: headers
    });

    return next.handle(authReq);
  }
}