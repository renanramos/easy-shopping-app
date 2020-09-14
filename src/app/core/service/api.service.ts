import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  protected get(url: string, filter?: string): Observable<T | T[]> {
    return this.httpClient.get<T>(`${this.API_URL}${url}${filter ? filter : ''}`);
  }

  protected post(url: string, object: T): Observable<T> {
    return this.httpClient.post<T>(`${this.API_URL}${url}`, object);
  }

  protected patch(url: string, object: T): Observable<T> {
    return this.httpClient.patch<T>(`${this.API_URL}${url}`, object);
  }

  protected delete(url: string): Observable<T> {
    return this.httpClient.delete<any>(`${this.API_URL}${url}`);
  }
}