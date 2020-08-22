import { AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe, PercentPipe, registerLocaleData } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { LoginModule } from './modules/login/login.module';
import { MainModule } from './modules/main/main.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    LoginModule,
    MainModule
  ],
  providers: [
    {
      provide: LOCALE_ID, useValue: 'pt'
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
