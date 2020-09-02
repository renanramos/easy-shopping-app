import { ApiService } from '../api.service';
import { UserCredentials } from '../../models/user/user-credentials.model';
import { Injector, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConstants } from '../../shared/constants/auth-constants';

@Injectable()
export class SecurityUserService extends ApiService<UserCredentials> {
 
  private token: string = null;

  constructor(
    private router: Router,
    private injector: Injector) {
    super(injector);
  }

  setToken(token: string) {
    localStorage.setItem(AuthConstants.AUTH_TOKEN, token);
    this.token = token;
  }

  setUsername(username: string) {
    localStorage.setItem(AuthConstants.USERNAME, username);
  }

  setUserRole(role: string) {
    localStorage.setItem(AuthConstants.USER_ROLE, role);
  }

  logout() {
    const requestLogout = {
      next: () => {
        this.deleteCookieFromStorage();
      },
      error: (error) => {
        this.deleteCookieAndRedirect();
      }
    };

    this.post('/user/logout', null).subscribe(requestLogout);
  }

  deleteCookieFromStorage() {
    localStorage.removeItem(AuthConstants.AUTH_TOKEN);
    localStorage.removeItem(AuthConstants.USERNAME);
    localStorage.removeItem(AuthConstants.USER_ROLE);
  }

  deleteCookieAndRedirect() {
    this.deleteCookieFromStorage();
    this.token = null;
    this.router.navigate(['/']);
  }

  isUserLogged() {
    return !!localStorage.getItem(AuthConstants.AUTH_TOKEN);
  }

  getLoggedUsername(): string {
    return localStorage.getItem(AuthConstants.USERNAME);
  }

  getUserLoggedToken() {
    return localStorage.getItem(AuthConstants.AUTH_TOKEN)
  }
}