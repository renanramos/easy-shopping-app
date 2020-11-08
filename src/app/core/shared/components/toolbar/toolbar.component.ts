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
import { Product } from 'src/app/core/models/product/product.model';
import { SnackbarService } from '../../service/snackbar.service';
import { ConstantMessages } from '../../constants/constant-messages';
import { UserAuthService } from 'src/app/core/service/auth/user-auth-service.service';
import { tap } from 'rxjs/operators';

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
  userUpdatedSubscription: Subscription;

  isUserLoggedIn: boolean = false;
  authConfig: AuthConfig = environment.authConfig;
  shoppingCartSubscription: Subscription;
  totalItemsShoppingCart: number = 0;
  productsInShoppingCart: Product[] = [];
  isUserSynchronized: boolean = false;

  constructor(private router: Router,
    public dialog: MatDialog,
    private securityUserService: SecurityUserService,
    private searchService: SearchService,
    private oauthService: OAuthService,
    private shoppingCartService: ShoppingCartService,
    private snackBarService: SnackbarService,
    private userService: UserAuthService) { }

  async ngOnInit() {
    await this.configureOAuthProperties();
    this.subscribeToSearchService();
    this.subscribeToShoppingCart();
    this.subscribeToUserUpdate();
    this.setShoppingCartProperties();
    this.isUserLoggedIn = this.securityUserService.isUserLogged();
    this.userLoggedName = this.securityUserService.userLoggedUsername;
    if (this.isUserLoggedIn) {
      await this.loadUserProperties();
    }
  }

  async loadUserProperties() {
    const userProfile = {
      next: (user) => {
        this.isUserSynchronized = user['sync'];
      },
      error: () => {  }
    };

    await this.userService.profileInfo()
      .pipe(tap(userProfile))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  setShoppingCartProperties() {
    this.totalItemsShoppingCart = this.shoppingCartService.getTotalProductsInStorage();
    this.productsInShoppingCart = this.shoppingCartService.getProductsParsed();
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
    this.shoppingCartSubscription
      && this.shoppingCartSubscription.unsubscribe();
    this.userUpdatedSubscription
      && this.userUpdatedSubscription.unsubscribe();
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

  subscribeToShoppingCart() {
    this.shoppingCartSubscription = this.shoppingCartService.newItem$.subscribe((total) => { 
      this.totalItemsShoppingCart = total;
      this.productsInShoppingCart = this.shoppingCartService.getProductsParsed();
    });
  }

  subscribeToUserUpdate() {
    this.userUpdatedSubscription = this.securityUserService.userUpdated$.subscribe((isUpdated) => {
      this.isUserSynchronized = isUpdated;
    });
  }

  removeProductFromCart(prod: Product) {
    this.shoppingCartService.removeItemFromShoppingCart(prod);
    this.setShoppingCartProperties();
    this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_REMOVED, 'close');
  }
}
