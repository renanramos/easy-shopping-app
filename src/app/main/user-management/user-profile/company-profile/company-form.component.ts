import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';

import { CompanyService } from 'src/app/core/service/company/company.service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { Company } from 'src/app/core/models/registration/company.model';
import { SecurityUserService } from 'src/app/core/service/auth/security-user.service';

@Component({
  selector: 'es-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css'],
  providers: [CompanyService]
})
export class CompanyFormComponent implements OnInit {

  companyForm: FormGroup;
  currentCompanyId: string = null;
  company: Company = new Company();

  constructor(
    private companyService: CompanyService,
    private snackBar: SnackbarService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CompanyFormComponent>,
    private securityUserService: SecurityUserService) { }

  async ngOnInit() {
    this.currentCompanyId = this.securityUserService.userLoggedId;
    if (this.securityUserService.isUserSyncronized) {
      await this.loadCompanyInfo();
    }
    this.createForm();
  }

  createForm() {
    this.companyForm = this.formBuilder.group({
      registeredNumber: [ this.company ? this.company['registeredNumber'] : '', [Validators.required]],
      phone: [ this.company ? this.company['phone'] : '', [Validators.required]]
    });
  }

 async onSubmitCompany() {
    this.companyForm.valid && this.securityUserService.isEmailVerified ?
      await this.handleCompanyOperations() :
      this.companyForm.markAllAsTouched();
  }


  async handleCompanyOperations() {
    this.company['registeredNumber'] ?
      await this.updateCompany() :
      await this.saveCompany();
  }

  async saveCompany() {
    const company: Company = this.companyForm.getRawValue();
    company.name = this.securityUserService.userLoggedUsername;
    company.email = this.securityUserService.userLoggedEmail;

    const receivedCompany = {
      next: (company: Company) => {
        this.dialogRef.close(company);
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

  async updateCompany() {
    const company: Company = this.companyForm.getRawValue();
    company.name = this.securityUserService.userLoggedUsername;
    company.email = this.securityUserService.userLoggedEmail;

    const companyUpdated = {
      next: (company: Company) => {
        this.dialogRef.close(company);
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBar.openSnackBar(errorMessage);
      }
    };

    await this.companyService.updateCompany(company, this.currentCompanyId)
      .pipe(tap(companyUpdated))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  get registeredNumber() {
    return this.companyForm.get('registeredNumber');
  }

  get phone() {
    return this.companyForm.get('phone');
  }

  async loadCompanyInfo() {

    const companyInfoReceived = {
      next: (companyInfo) => {
        this.company = companyInfo ? companyInfo : new Company();
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBar.openSnackBar(errorMessage, 'close');
      }
    }

    await this.companyService.getCompanyByTokenId(this.currentCompanyId)
      .pipe(tap(companyInfoReceived))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
