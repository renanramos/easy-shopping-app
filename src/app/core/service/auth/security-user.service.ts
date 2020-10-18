import { ApiService } from '../api.service';
import { UserCredentials } from '../../models/user/user-credentials.model';
import { Injector, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConstants } from '../../shared/constants/auth-constants';
import { UserRolesConstants } from '../../shared/constants/user-roles-constants';
import * as jwt_decode from 'jwt-decode';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class SecurityUserService extends ApiService<UserCredentials> {
 
  decodedToken: string = '';

  constructor(
    private router: Router,
    private oauthService: OAuthService,
    injector: Injector) {
    super(injector);
    this.setUserPropertiesFromToken();
  }

  setUserPropertiesFromToken() {
    if (this.oauthService.getAccessToken()) {
      this.decodedToken = jwt_decode(this.oauthService.getAccessToken());
    }
  }

  isUserLogged() {
    return !!this.oauthService.getIdToken();
  }

  getLoggedUsername(): string {
    return this.decodedToken['given_name'];
  }

  get userLoggedId(): string {
    return this.decodedToken['sub'].toString();
  }

  get isAdminUser() {
    return this.decodedToken && this.decodedToken['resource_access']['easy-shopping']['roles'][0] === UserRolesConstants.ADMINISTRATOR
  }

  get userLoggedRole() {
    return this.decodedToken && this.decodedToken['resource_access']['easy-shopping']['roles'][0];
  }
}