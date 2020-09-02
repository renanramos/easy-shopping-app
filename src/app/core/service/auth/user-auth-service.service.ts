import { Injectable, Injector } from '@angular/core';
import { ApiService } from '../api.service';
import { Login } from '../../models/user/login.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService extends ApiService<Login>{

  private url: string = '/users';

  constructor(injector: Injector) {
    super(injector);
  }

  login(login: Login): Observable<Login> {
    return this.post(`${this.url}/login`, login);
  }

  logout(): Observable<any>{
    return this.post(`${this.url}/logout`, null);
  }
}