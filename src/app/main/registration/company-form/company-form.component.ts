import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { passwordMatcher } from '../../../core/shared/validators/password-matcher';
import { CompanyService } from '../../../core/service/company/company.service';
import { SnackbarService } from '../../../core/shared/service/snackbar.service';
import { UtilsService } from '../../../core/shared/utils/utils.service';
import { Company } from '../../../core/models/registration/company.model';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { SearchService } from 'src/app/core/shared/service/search-service';
import { AlertDialogComponent } from 'src/app/core/shared/components/alert-dialog/alert-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'es-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css'],
  providers: [CompanyService]
})
export class CompanyFormComponent implements OnInit, OnDestroy {

  companyForm: FormGroup;

  passwordVisibility: boolean = false;
  passwordInputType: string = 'password';

  alertDialogRef: MatDialogRef<AlertDialogComponent>;

  constructor(
    private companyService: CompanyService,
    private snackBar: SnackbarService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private searchService: SearchService,
    private dialog: MatDialog,
    private router: Router) { }

  ngOnInit() {
    this.createForm();
    this.hideSearchFiled();
  }

  ngOnDestroy() {
    this.searchService.hideSearchFieldOption(false);
  }

  hideSearchFiled() {
    this.searchService.hideSearchFieldOption(true);
  }

  createForm() {
    this.companyForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      registeredNumber: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    },
    {
     validator: passwordMatcher('password', 'confirmPassword')
    });
  }

 async onSubmitCompany() {
    this.companyForm.invalid ?
      this.companyForm.markAllAsTouched() :
      await this.saveCompany();
  }

  async saveCompany() {
    const company: Company = this.companyForm.getRawValue();

    const receivedCompany = {
      next: (newCompany: Company) => {
        this.router.navigate(['/']);
        this.openAlertDialog();
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBar.openSnackBar(errorMessage);
      }
    }

    await this.companyService.saveCompany(company)
      .pipe(tap(receivedCompany))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  openAlertDialog() {
    this.router.navigate(['/']);
    
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
    return this.companyForm.get('name');
  }
  
  get registeredNumber() {
    return this.companyForm.get('registeredNumber');
  }

  get phone() {
    return this.companyForm.get('phone');
  }

  get email() {
    return this.companyForm.get('email');
  }

  get password() {
    return this.companyForm.get('password');
  }

  get confirmPassword() {
    return this.companyForm.get('confirmPassword');
  }
}
