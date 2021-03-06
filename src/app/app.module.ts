import { AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, PercentPipe, registerLocaleData } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule, LOCALE_ID, } from '@angular/core';
import { CookieService } from "ngx-cookie-service";
import localePt from '@angular/common/locales/pt';
import { NgSlimScrollModule, SLIMSCROLL_DEFAULTS  } from "ngx-slimscroll";

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ScaffoldModule } from './scaffold/scaffold.module';
import { HttpIntercept } from './core/interceptors/http-intercept.service';
import { MainModule } from './main/main.module';
import { PipeModule } from './core/shared/pipe/pipe.module';
import { SecurityUserService } from './core/service/auth/security-user.service';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { DirectivesModule } from './core/shared/directives/directives.modules';
import { GlobalLoaderService } from './core/shared/service/global-loader.service';
import { LoaderInterceptor } from './core/interceptors/loader-interceptor.service';
import { LoaderComponent } from './core/shared/components/loader/loader.component';
import { AlertDialogComponent } from './core/shared/components/alert-dialog/alert-dialog.component';
import { SocialLoginModule } from 'angularx-social-login';
import { KeycloakAngularModule } from 'keycloak-angular';
import { OAuthModule } from 'angular-oauth2-oidc';
import { environment } from '../environments/environment';
import { AuthGuard } from './core/guard/auth.guard';
import { ChartsModule } from 'ng2-charts';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

registerLocaleData(localePt, 'pt-BR');

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    AlertDialogComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    ScaffoldModule,
    KeycloakAngularModule,
    MainModule,
    PipeModule,
    DirectivesModule,
    NgSlimScrollModule,
    SocialLoginModule,
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [environment.apiUrl],
        sendAccessToken: true
      }
    }),
    NgxMaskModule.forRoot(),
    ChartsModule
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    },
    SecurityUserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpIntercept,
      multi: true
    },
    {
      provide: LOCALE_ID, useValue: 'pt-BR'
    },
    {
      provide: SLIMSCROLL_DEFAULTS,
      useValue: {
        alwaysVisible: true,
        gridOpacity: '0.2',
        barOpacity: '0.5',
        gridBackground: '#c2c2c2',
        gridWidth: '6',
        gridMargin: '2px 2px',
        barBackground: '#515151',
        barWidth: '6',
        barMargin: '2px 2px'
      },
    },
    AsyncPipe,
    CookieService,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    PercentPipe,
    GlobalLoaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }