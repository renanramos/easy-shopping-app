import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Event, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginFormComponent } from 'src/app/login/components/login-form/login-form.component';
import { UserCredentials } from 'src/app/core/models/user/user-credentials.model';
import { SecurityUserService } from 'src/app/core/service/auth/security-user.service';
import { UserAuthService } from 'src/app/core/service/auth/user-auth-service.service';
import { tap } from 'rxjs/operators';
import { SearchService } from '../../service/search-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'es-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @Output() menuEvent = new EventEmitter<any>();
  @Input() showMenuIcon: boolean = true;
  @Input() showSearchInput: boolean = true;
  userLoggedName: string = '';

  searchFilter: Subscription;

  constructor(private router: Router,
    public dialog: MatDialog,
    private authService: UserAuthService,
    private securityUserService: SecurityUserService,
    private searchService: SearchService) { }

  ngOnInit(): void {
    this.userLoggedName = this.securityUserService.getLoggedUsername();
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
        this.homePage();
      }
    });
  }

  async logout() {

    const receivedLogout = {
      next: () => {
        this.securityUserService.deleteCookieAndRedirect();
        this.userLoggedName = '';
        this.router.navigate(['/']);
      }
    }

    await this.authService.logout().pipe(tap(receivedLogout))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  redirectPage(routeName: string) {
    this.router.navigate([routeName]);
  }

  clearCookieValues() {
    this.securityUserService.deleteCookieFromStorage();
  }

  onSearchFilter(event: any) {
    this.searchService.searchFilterContent(event.target.value);
  }
}
