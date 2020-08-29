import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { CustomerService } from 'src/app/core/service/customer/customer.service';
import { Customer } from 'src/app/core/models/registration/customer.model';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'es-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css'],
  providers: [CustomerService]
})
export class CustomerFormComponent implements OnInit {

  isWaitingReponse: boolean = false;
  customerForm: FormGroup;

  constructor(private formBuider: FormBuilder,
    private customerService: CustomerService,
    private snackBar: SnackbarService,
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
    });
  }

  async onSubmitCustomer() {
    this.customerForm.valid ?
      await this.saveCustomer() :
      this.customerForm.markAllAsTouched();
  }

  async saveCustomer() {
    this.isWaitingReponse = true;
    const customer: Customer = this.customerForm.getRawValue();

    const customerReceived = {
      next: (newCustomer) => {
       this.route.navigate(['/']);
       this.isWaitingReponse = false;
       this.snackBar.openSnackBar('Usuário criado com sucesso!');
      },
      error: (response) => {
       const errorMessage = this.handleErrorMessage(response);
       this.snackBar.openSnackBar(errorMessage);
       this.isWaitingReponse = false;
      }
    };

   await this.customerService.saveCustomer(customer)
    .pipe(tap(customerReceived))
    .toPromise()
    .then(() => true)
    .catch(() => false);
  }

  handleErrorMessage(response: any) {
    return response.error.errors && response.error.errors.length ? 
                response.error.errors[0] :
                response.error.message;
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
}
