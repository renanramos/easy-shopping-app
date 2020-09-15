import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { CustomerService } from 'src/app/core/service/customer/customer.service';
import { Customer } from 'src/app/core/models/registration/customer.model';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { passwordMatcher } from 'src/app/core/shared/validators/password-matcher';

@Component({
  selector: 'es-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css'],
  providers: [CustomerService]
})
export class CustomerFormComponent implements OnInit {

  customerForm: FormGroup;

  passwordVisibility: boolean = false;
  passwordInputType: string = 'password';

  constructor(private formBuider: FormBuilder,
    private customerService: CustomerService,
    private snackBar: SnackbarService,
    private utilsService: UtilsService,
    private route: Router) { }

  ngOnInit() {
    this.createForm();
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
        newCustomer ?
          this.snackBar.openSnackBar('Usuário criado com sucesso!') :
          this.snackBar.openSnackBar('A requisição foi efetuada, mas não obtivemos resposta');
        this.route.navigate(['/']);
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
}
