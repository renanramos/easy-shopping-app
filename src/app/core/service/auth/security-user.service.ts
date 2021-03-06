import { ApiService } from '../api.service';
import { UserCredentials } from '../../models/user/user-credentials.model';
import { Injector, Injectable } from '@angular/core';
import { UserRolesConstants } from '../../shared/constants/user-roles-constants';
import * as jwt_decode from 'jwt-decode';
import { OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';
import { AuthConstants } from '../../shared/constants/auth-constants';

@Injectable()
export class SecurityUserService extends ApiService<UserCredentials> {
 
  decodedToken: string = '';
  userUpdated: Subject<boolean> = new Subject<boolean>();
  userUpdated$ = this.userUpdated.asObservable();

  constructor(
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

  get userLoggedUsername(): string {
    return this.oauthService.getIdentityClaims() ? this.oauthService.getIdentityClaims()['given_name'] : "";
  }

  get userLoggedId(): string {
    return this.oauthService.getIdentityClaims()['sub'];
  }

  get userLoggedRole() {
    return this.decodedToken && this.decodedToken['resource_access']['easy-shopping']['roles'][0];
  }

  get isAdminUser() {
    return this.decodedToken && this.userLoggedRole === UserRolesConstants.ADMINISTRATOR
  }

  get isEmailVerified() {
    return this.oauthService.getIdentityClaims()['email_verified'];
  }

  get userLoggedEmail() {
    return this.oauthService.getIdentityClaims()['email'];
  }

  get userName() {
    return this.oauthService.getIdentityClaims()['name'];
  }
  get isUserSyncronized() {
    return sessionStorage.getItem(AuthConstants.SYNC);
  }

  setUserSyncronized(sync: boolean) {
    sessionStorage.setItem(AuthConstants.SYNC, `${sync}`);
  }
}