import { ApiService } from '../api.service';
import { UserCredentials } from '../../models/user/user-credentials.model';
import { Injector, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConstants } from '../../shared/constants/auth-constants';
import { UserRolesConstants } from '../../shared/constants/user-roles-constants';
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class SecurityUserService extends ApiService<UserCredentials> {
 
  constructor(
    private router: Router,
    injector: Injector) {
    super(injector);
  }

  setToken(token: string) {
    localStorage.setItem(AuthConstants.AUTH_TOKEN, token);
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
    localStorage.removeItem(AuthConstants.AUTH_TOKEN);
  }

  deleteCookieAndRedirect() {
    this.deleteCookieFromStorage();
    this.router.navigate(['/']);
  }

  isUserLogged() {
    return !!localStorage.getItem(AuthConstants.AUTH_TOKEN);
  }

  getLoggedUsername(): string {
    return localStorage.getItem(AuthConstants.USERNAME);
  }

  getUserLoggedToken() {
    return localStorage.getItem(AuthConstants.AUTH_TOKEN);
  }

  get isAdminUser() {
    return localStorage.getItem(AuthConstants.USER_ROLE) === UserRolesConstants.ADMINISTRATOR;
  }

  get idUserLoggedIn() {
    const token = localStorage.getItem(AuthConstants.AUTH_TOKEN);
    const decodedToken = jwt_decode(token);
    return decodedToken['user_id'];
  }

  get userLoggedRole() {
    return localStorage.getItem(AuthConstants.USER_ROLE);
  }
}