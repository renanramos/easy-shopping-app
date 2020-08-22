import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from "rxjs/operators";

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService<T> {

  private API_URL: string;
  private httpClient: HttpClient;

  constructor(injector: Injector) {
    this.API_URL = environment.apiUrl;
    this.httpClient = injector.get(HttpClient);
  }

  protected get(url: string, filter?: string, showLoading: boolean = false): Observable<T> {
    return this.httpClient.get<T>(`${this.API_URL}${url}${filter ? filter : ''}`);
  }

  protected post(url: string, object: T, showLoading: boolean = false): Observable<T> {
    return this.httpClient.post<T>(`${this.API_URL}${url}`, object);
  }

  protected put(url: string, object: T, showLoading: boolean = false): Observable<T> {
    return this.httpClient.put<T>(`${this.API_URL}${url}`, object);
  }

  protected delete(url: string, showLoading: boolean = false): Observable<T> {
    return this.httpClient.delete<any>(`${this.API_URL}${url}`);
  }

  
}