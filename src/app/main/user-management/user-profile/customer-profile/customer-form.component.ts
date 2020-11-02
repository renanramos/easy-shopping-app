import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';

import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { CustomerService } from 'src/app/core/service/customer/customer.service';
import { Customer } from 'src/app/core/models/registration/customer.model';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { UserAuthService } from 'src/app/core/service/auth/user-auth-service.service';
import { SecurityUserService } from 'src/app/core/service/auth/security-user.service';

@Component({
  selector: 'es-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css'],
  providers: [CustomerService, UserAuthService]
})
export class CustomerFormComponent implements OnInit {

  customerForm: FormGroup;
  currentCustomerId: string = null;
  customer: Customer = null;

  constructor(private formBuider: FormBuilder,
    private customerService: CustomerService,
    private snackBar: SnackbarService,
    private utilsService: UtilsService,
    private dialogRef: MatDialogRef<CustomerFormComponent>,
    private securityUserService: SecurityUserService) { }

  async ngOnInit() {
    this.currentCustomerId = this.securityUserService.userLoggedId;
    await this.loadCustomerInfo();
    this.createForm();
  }

  createForm() {
    this.customerForm = this.formBuider.group({
      cpf: [this.customer ? this.customer['cpf'] : '', [Validators.required]]
    });
  }

  async onSubmitCustomer() {
    this.customerForm.valid ?
      await this.handleCustomerOperation() :
      this.customerForm.markAllAsTouched();
  }

  async handleCustomerOperation() {
    this.customer['cpf'] ?
    await this.updateCustomer() :
    await this.saveCustomer();
  }

  async saveCustomer() {
    const customer: Customer = this.customerForm.getRawValue();
    customer.name = this.securityUserService.userLoggedUsername;
    customer.email = this.securityUserService.userLoggedEmail;
    const customerReceived = {
      next: (customer) => {
        this.dialogRef.close(customer);
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

  async updateCustomer() {
    const customer: Customer = this.customerForm.getRawValue();
    customer.name = this.securityUserService.userLoggedUsername;
    customer.email = this.securityUserService.userLoggedEmail;

    const customerUpdated = {
      next: (customer) => {
        this.dialogRef.close(customer);
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
       this.snackBar.openSnackBar(errorMessage);
      }
    };

    await this.customerService.updateCustomer(customer, this.currentCustomerId)
      .pipe(tap(customerUpdated))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  get cpf() {
    return this.customerForm.get('cpf');
  }

  async loadCustomerInfo() {

    const customerInfoReceived = {
      next: (customerInfo) => {
        this.customer = customerInfo ? customerInfo : new Customer();
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBar.openSnackBar(errorMessage, 'close');
      }
    }

    await this.customerService.getCustomerByTokenId(this.currentCustomerId)
      .pipe(tap(customerInfoReceived))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
