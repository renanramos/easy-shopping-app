import { Component, OnInit } from '@angular/core';

import { CustomerService } from 'src/app/core/service/customer/customer.service';
import { Customer } from 'src/app/core/models/registration/customer.model';
import { tap } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CustomerDetailComponent } from '../customer-detail/customer-detail.component';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { ConstantMessages } from 'src/app/core/shared/constants/constant-messages';

@Component({
  selector: 'es-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  providers: [CustomerService]
})
export class CustomerListComponent implements OnInit {

  isLoadingCustomers: boolean = false;
  noCustomerFound: boolean = false;
  customers: Customer[] = [];

  dialogRef: MatDialogRef<CustomerDetailComponent>;

  constructor(private customerService: CustomerService,
    private dialog: MatDialog,
    private snackBarService: SnackbarService) { }

  async ngOnInit() {
    await this.loadCustomers();
  }

  async loadCustomers() {
    this.isLoadingCustomers = true;
    const receivedCustomers = {
      next: (customers: Customer[]) => {
        if (customers.length) {
          this.customers = customers;
        } else {
          this.noCustomerFound = true;
        }
        this.isLoadingCustomers = false;
      },
      error: (error) => {
        this.isLoadingCustomers = false;
        this.noCustomerFound = true;
      }
    }

    await this.customerService.getCustomers()
      .pipe(tap(receivedCustomers))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  openEditCustomer(customer: Customer) {

    const receivedDialogResponse = {
      next: (customerUpdated) => {
        if(customerUpdated) {
          this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_UPDATED);
        }
      }
    }

    this.dialogRef = this.dialog.open(CustomerDetailComponent, {
      data: { customer: customer, isViewing: true },
      autoFocus: false,
      disableClose: true,
      panelClass: 'es-dialog'
    });

    this.dialogRef.afterClosed().subscribe(receivedDialogResponse);
  }
}
