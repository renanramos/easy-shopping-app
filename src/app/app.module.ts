import { AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, PercentPipe, registerLocaleData } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule, LOCALE_ID } from '@angular/core';
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
import { LoginModule } from './login/login.module';
import { RegistrationModule } from './main/registration/registration.module';
import { HttpIntercept } from './core/interceptors/http-intercept.service';
import { MainModule } from './main/main.module';
import { PipeModule } from './core/shared/pipe/pipe.module';
import { SecurityUserService } from './core/service/auth/security-user.service';
import { NgxMaskModule, IConfig } from 'ngx-mask';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

registerLocaleData(localePt, 'pt-BR');

@NgModule({
  declarations: [
    AppComponent
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
    LoginModule,
    MainModule,
    PipeModule,
    RegistrationModule,
    NgSlimScrollModule,
    NgxMaskModule.forRoot()
  ],
  providers: [
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
      }
    },
    AsyncPipe,
    CookieService,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    PercentPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }