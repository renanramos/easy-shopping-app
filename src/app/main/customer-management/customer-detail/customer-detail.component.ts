import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Customer } from 'src/app/core/models/registration/customer.model';
import { CustomerService } from 'src/app/core/service/customer/customer.service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'es-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css'],
  providers: [CustomerService]
})
export class CustomerDetailComponent implements OnInit {

  customer: Customer;
  customerForm: FormGroup;

  constructor(
    private customerService: CustomerService,
    private snackBarService: SnackbarService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CustomerDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.customer = this.data['customer'];
    this.createForm();
  }

  createForm() {
    this.customerForm = this.formBuilder.group({
      name: [this.customer['name'], [Validators.required]],
      cpf: [this.customer['cpf'], [Validators.required]],
      email: [this.customer['email'], [Validators.email, Validators.required]],
    });
  }

  async submitCustomerUpdated() {
    this.customerForm.invalid ?
      this.customerForm.markAllAsTouched() :
      await this.updateCustomer();
  }

  async updateCustomer() {
    const customer = this.customerForm.getRawValue();
    customer['id'] = this.customer['id'];

    const receivedCustomerUpdate = {
      next: (customerUpdated) => {
        if (customerUpdated) {
          this.dialogRef.close(customerUpdated);
        }
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
      }
    }

    await this.customerService.updateCustomer(customer)
    .pipe(tap(receivedCustomerUpdate))
    .toPromise()
    .then(() => true)
    .catch(() => false);
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
