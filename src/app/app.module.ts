import { AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, PercentPipe, registerLocaleData } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";

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
import localePt from '@angular/common/locales/pt';
import { LoginModule } from './login/login.module';
import { RegistrationModule } from './main/sign-up/registration.module';

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
    RegistrationModule
  ],
  providers: [
    {
      provide: LOCALE_ID, useValue: 'pt-BR'
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
