import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SecurityUserService } from '../service/auth/security-user.service';
import { Observable } from 'rxjs';
import { SnackbarService } from '../shared/service/snackbar.service';
import { ConstantMessages } from '../shared/constants/constant-messages';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private securityUserService: SecurityUserService,
              private router: Router,
              private snackBarService: SnackbarService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    let isUserLogged = this.securityUserService.isUserLogged();

    if (!isUserLogged) {
      this.router.navigateByUrl('/');
      this.snackBarService.openSnackBar(ConstantMessages.UNAUTHORIZED_USER);
      return false;
    }
    return true;
  }

}