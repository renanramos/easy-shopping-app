import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { CustomerService } from 'src/app/core/service/customer/customer.service';
import { Customer } from 'src/app/core/models/registration/customer.model';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { passwordMatcher } from 'src/app/core/shared/validators/password-matcher';
import { SearchService } from 'src/app/core/shared/service/search-service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/core/shared/components/alert-dialog/alert-dialog.component';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { UserAuthService } from 'src/app/core/service/auth/user-auth-service.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'es-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css'],
  providers: [CustomerService, SocialAuthService, UserAuthService]
})
export class CustomerFormComponent implements OnInit, OnDestroy {

  customerForm: FormGroup;
  socialUser: SocialUser;

  passwordVisibility: boolean = false;
  passwordInputType: string = 'password';

  alertDialogRef: MatDialogRef<AlertDialogComponent>;

  constructor(private formBuider: FormBuilder,
    private customerService: CustomerService,
    private snackBar: SnackbarService,
    private utilsService: UtilsService,
    private searchService: SearchService,
    private dialog: MatDialog,
    private route: Router,
    private socialAuthService: SocialAuthService,
    private userAuthService: UserAuthService) { }

  ngOnInit() {
    this.createForm();
    this.hideSearchFiled();
    this.subscribeToAuthState();
  }

  ngOnDestroy() {
    this.searchService.hideSearchFieldOption(false);
  }

  hideSearchFiled() {
    this.searchService.hideSearchFieldOption(true);
  }

  createForm() {
    this.customerForm = this.formBuider.group({
      name: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    },{
      validator: passwordMatcher('password', 'confirmPassword')
    });
  }

  async onSubmitCustomer() {
    this.customerForm.valid ?
      await this.saveCustomer() :
      this.customerForm.markAllAsTouched();
  }

  async saveCustomer() {
    const customer: Customer = this.customerForm.getRawValue();

    const customerReceived = {
      next: (newCustomer) => {
        this.openAlertDialog(newCustomer);
      },
      error: (response) => {
       const errorMessage = this.utilsService.handleErrorMessage(response);
       this.snackBar.openSnackBar(errorMessage);
      }
    };

   await this.customerService.saveCustomer(customer)
    .pipe(tap(customerReceived))
    .toPromise()
    .then(() => true)
    .catch(() => false);
  }

  openAlertDialog(customer: Customer) {
    this.route.navigate(['/']);
    
    this.alertDialogRef = this.dialog.open(AlertDialogComponent, {
      data: {},
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-small-dialog'
    });

    this.alertDialogRef.afterClosed().subscribe();
  }

  changeInputPasswordVisibility() {
    this.passwordVisibility = !this.passwordVisibility;
    this.passwordVisibility ?
      this.passwordInputType = 'text' :
      this.passwordInputType = 'password';
  }

  get name() {
    return this.customerForm.get('name');
  }

  get cpf() {
    return this.customerForm.get('cpf');
  }

  get email() {
    return this.customerForm.get('email');
  }

  get password() {
    return this.customerForm.get('password');
  }

  get  confirmPassword() {
    return this.customerForm.get('confirmPassword');
  }

  subscribeToAuthState() {
    this.socialAuthService.authState.subscribe((user: SocialUser) => {
      this.socialUser = user;
    })
  }

  signInWithGoogle() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
}
