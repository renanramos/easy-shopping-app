import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SecurityUserService } from 'src/app/core/service/auth/security-user.service';
import { SearchService } from '../../service/search-service';
import { Subject, Subscription } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { AuthConfig, NullValidationHandler, OAuthService } from 'angular-oauth2-oidc';
import { OAuthEvent } from 'angular-oauth2-oidc/events';
import { environment } from '../../../../../environments/environment';
import { ShoppingCartService } from 'src/app/core/service/shopping-cart/shopping-cart.service';

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
  authConfig: AuthConfig = environment.authConfig;
  shoppingCartSubscription: Subscription;
  totalItemsShoppingCart: number = 0;

  constructor(private router: Router,
    public dialog: MatDialog,
    private securityUserService: SecurityUserService,
    private searchService: SearchService,
    private oauthService: OAuthService,
    private shoppingCartService: ShoppingCartService) { }

  async ngOnInit() {
    await this.configureOAuthProperties();
    this.subscribeToSearchService();
    this.subscribeToShoppinCart();
    this.isUserLoggedIn = this.securityUserService.isUserLogged();
    this.userLoggedName = this.securityUserService.userLoggedUsername;
    this.totalItemsShoppingCart = this.shoppingCartService.getTotalProductsInStorage();
  }

  async configureOAuthProperties() {
    this.oauthService.configure(this.authConfig);
    this.oauthService.tokenValidationHandler = new NullValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
    this.oauthService.events.subscribe(({ type }: OAuthEvent) => {
      switch (type) {
        case 'token_received':
          this.securityUserService.setUserPropertiesFromToken();
          this.isUserLoggedIn = this.securityUserService.isUserLogged();
          this.userLoggedName = this.securityUserService.userLoggedUsername ? this.securityUserService.userLoggedUsername : "";
          window.location.reload();
          break;
        }
    });
  }

  ngOnDestroy() {
    this.searchFilter
      && this.searchFilter.unsubscribe();
  }

  eventMenuHandler($event) {
    this.menuEvent.emit(true);
  }

  homePage() {
    this.router.navigateByUrl('/');
  }

  login() {
    this.oauthService.initLoginFlow();
  }

  async logout() {
    this.oauthService.logOut();
    this.router.navigateByUrl('/');
  }

  redirectPage(routeName: string) {
    this.inputSearchField.nativeElement.value = "";
    this.router.navigateByUrl(`/main${routeName}`);
  }

  onSearchFilter(event: any) {
    this.searchService.searchFilterContent(event.target.value);
  }

  subscribeToSearchService() {
    this.searchFilter = this.searchService.hideSearchField$.subscribe((value) => this.hideSearchInput = value);
  }

  subscribeToShoppinCart() {
    this.shoppingCartSubscription = this.shoppingCartService.newItem$.subscribe((total) => { 
      this.totalItemsShoppingCart = total;
    });
  }  
}
