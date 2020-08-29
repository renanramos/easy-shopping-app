import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { passwordMatcher } from '../../../core/shared/validators/password-matcher';
import { CompanyService } from '../../../core/service/company/company.service';
import { SnackbarService } from '../../../core/shared/service/snackbar.service';
import { UtilsService } from '../../../core/shared/utils/utils.service';
import { Company } from '../../../core/models/registration/company.model';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'es-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css'],
  providers: [CompanyService]
})
export class CompanyFormComponent implements OnInit {

  isWaitingResponse: boolean = false;
  companyForm: FormGroup;

  constructor(
    private companyService: CompanyService,
    private snackBar: SnackbarService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.createForm();
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
    this.isWaitingResponse = true;
    this.companyForm.invalid ?
      this.companyForm.markAllAsTouched() :
      await this.saveCompany();
  }

  async saveCompany() {
    const company: Company = this.companyForm.getRawValue();

    const receivedCompany = {
      next: (newCompany: Company) => {
        newCompany ?
          this.snackBar.openSnackBar('Empresa criada com sucesso!') :
          this.snackBar.openSnackBar('A requisição foi efetuada, mas não obtivemos resposta');

        this.isWaitingResponse = false;
        this.router.navigate(['/']);
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBar.openSnackBar(errorMessage);
        this.isWaitingResponse = false;
      }
    }

    await this.companyService.saveCompany(company)
      .pipe(tap(receivedCompany))
      .toPromise()
      .then(() => true)
      .catch(() => false);
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
