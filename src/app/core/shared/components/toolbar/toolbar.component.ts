import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Event, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginFormComponent } from 'src/app/login/components/login-form/login-form.component';
import { UserCredentials } from 'src/app/core/models/user/user-credentials.model';
import { SecurityUserService } from 'src/app/core/service/auth/security-user.service';
import { UserAuthService } from 'src/app/core/service/auth/user-auth-service.service';
import { SearchService } from '../../service/search-service';
import { Subscription } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { AuthConfig, NullValidationHandler, OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'es-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  providers: [KeycloakService, OAuthService]
})
export class ToolbarComponent implements OnInit, OnDestroy {

  @ViewChild('inputSearchField') inputSearchField: ElementRef<HTMLInputElement>;
  @Output() menuEvent = new EventEmitter<any>();
  @Input() showMenuIcon: boolean = true;
  hideSearchInput: boolean = false;
  userLoggedName: string = '';

  searchFilter: Subscription;
  clearSearchFilter: Subscription;
  isUserLoggedIn: boolean = false;

  authConfig: AuthConfig = {
    issuer: 'http://localhost:8083/auth/realms/easy-shopping',
    redirectUri: `${window.location.origin}/`,
    clientId: 'easy-shopping',
    scope: 'profile email roles',
    responseType: 'code',
    disableAtHashCheck: true,
    showDebugInformation: false
  }

  constructor(private router: Router,
    public dialog: MatDialog,
    private securityUserService: SecurityUserService,
    private searchService: SearchService,
    private oauthService: OAuthService) { }

  ngOnInit() {
    this.configureOAuthProperties();
    this.subscribeToSearchService();
    this.isUserLoggedIn = this.securityUserService.isUserLogged();
    this.userLoggedName = this.securityUserService.getLoggedUsername();
  }

  configureOAuthProperties() {
    this.oauthService.configure(this.authConfig);
    this.oauthService.tokenValidationHandler = new NullValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  ngOnDestroy() {
    this.searchFilter
      && this.searchFilter.unsubscribe();
  }

  eventMenuHandler($event) {
    this.menuEvent.emit(true);
  }

  homePage() {
    this.router.navigate(['/']);
  }

  login() {
    this.oauthService.initLoginFlow();
  }

  async logout() {
    this.oauthService.logOut();
  }

  redirectPage(routeName: string) {
    this.inputSearchField.nativeElement.value = "";
    this.router.navigate([routeName]);
  }

  onSearchFilter(event: any) {
    this.searchService.searchFilterContent(event.target.value);
  }

  subscribeToSearchService() {
    this.searchFilter = this.searchService.hideSearchField$.subscribe((value) => this.hideSearchInput = value);
  }
  
}
