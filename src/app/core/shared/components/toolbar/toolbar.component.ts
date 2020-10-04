import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Event, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginFormComponent } from 'src/app/login/components/login-form/login-form.component';
import { UserCredentials } from 'src/app/core/models/user/user-credentials.model';
import { SecurityUserService } from 'src/app/core/service/auth/security-user.service';
import { UserAuthService } from 'src/app/core/service/auth/user-auth-service.service';
import { tap } from 'rxjs/operators';
import { SearchService } from '../../service/search-service';
import { Subscription } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'es-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
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

  constructor(private router: Router,
    public dialog: MatDialog,
    private authService: UserAuthService,
    private keycloakService: KeycloakService,
    private securityUserService: SecurityUserService,
    private searchService: SearchService) { }

  ngOnInit() {
    this.userLoggedName = this.securityUserService.getLoggedUsername();
    this.isUserLoggedIn = this.securityUserService.idUserLoggedIn;
    this.subscribeToSearchService();
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

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginFormComponent, {
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-dialog'
    });

    dialogRef.afterClosed().subscribe((userCredentials: UserCredentials) => {
      this.clearCookieValues();
      if (userCredentials) {
        this.securityUserService.setUserRole(userCredentials.roles[0]);
        this.securityUserService.setUsername(userCredentials.username);
        this.securityUserService.setToken(userCredentials.token);
        this.userLoggedName = this.securityUserService.getLoggedUsername();
        this.isUserLoggedIn = this.securityUserService.idUserLoggedIn;
        window.location.reload();
        this.homePage();
      }
    });
  }

  async logout() {
    this.keycloakService.logout();
    // const receivedLogout = {
    //   next: () => {
    //     this.securityUserService.deleteCookieAndRedirect();
    //     this.userLoggedName = '';
    //     this.isUserLoggedIn = false;
    //     this.router.navigateByUrl('/');
    //     window.location.reload();
    //   }
    // }

    // await this.authService.logout().pipe(tap(receivedLogout))
    //   .toPromise()
    //   .then(() => true)
    //   .catch(() => false);
  }

  redirectPage(routeName: string) {
    this.inputSearchField.nativeElement.value = "";
    this.router.navigate([routeName]);
  }

  clearCookieValues() {
    this.securityUserService.deleteCookieFromStorage();
  }

  onSearchFilter(event: any) {
    this.searchService.searchFilterContent(event.target.value);
  }

  subscribeToSearchService() {
    this.searchFilter = this.searchService.hideSearchField$.subscribe((value) => this.hideSearchInput = value);
  }
  
}
