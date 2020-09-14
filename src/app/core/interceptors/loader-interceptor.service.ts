import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { GlobalLoaderService } from '../shared/service/global-loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(private globalLoaderService: GlobalLoaderService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const loadingSubscription: Subscription = this.globalLoaderService.loading$.subscribe();
    return next.handle(req).pipe(finalize(() => loadingSubscription.unsubscribe()));
  }
}