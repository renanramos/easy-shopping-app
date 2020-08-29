import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { LoginFormComponent } from 'src/app/login/components/login-form/login-form.component';
import { UserCredentials } from 'src/app/core/models/user/user-credentials.model';

@Component({
  selector: 'es-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @Output() menuEvent = new EventEmitter<any>();

  @Input() showMenuIcon: boolean = true;
  userLoggedName: string = "";

  constructor(private router: Router,
    public dialog: MatDialog,
    private cookieService: CookieService) { }

  ngOnInit(): void {
    this.userLoggedName = this.cookieService.get('username');
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
      if (userCredentials) {
        this.cookieService.set('role', userCredentials.roles[0]);
        this.cookieService.set('username', userCredentials.username);
        this.cookieService.set('token', userCredentials.token);
        this.userLoggedName = this.cookieService.get('username');
      }
    });
  }

  logout() {
    this.cookieService.deleteAll();
    this.userLoggedName = "";
  }

  onRedirectSignUp() {
    this.router.navigate(['/registration']);
  }
}
