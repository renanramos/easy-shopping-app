import { Component, OnInit } from '@angular/core';

import { CustomerService } from 'src/app/core/service/customer/customer.service';
import { Customer } from 'src/app/core/models/registration/customer.model';
import { tap } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CustomerDetailComponent } from '../customer-detail/customer-detail.component';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { ConstantMessages } from 'src/app/core/shared/constants/constant-messages';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { ScrollValues } from 'src/app/core/shared/constants/scroll-values';

@Component({
  selector: 'es-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  providers: [CustomerService]
})
export class CustomerListComponent implements OnInit {

  selector: string = '.main-container';
  noCustomerFound: boolean = false;
  customers: Customer[] = [];
  pageNumber: number = ScrollValues.DEFAULT_PAGE_NUMBER;

  dialogRef: MatDialogRef<CustomerDetailComponent>;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(private customerService: CustomerService,
    private utilsService: UtilsService,
    private dialog: MatDialog,
    private snackBarService: SnackbarService) { }

  async ngOnInit() {
    await this.loadCustomers();
  }

  async loadCustomers() {
    const receivedCustomers = {
      next: (customers: Customer[]) => {
        if (customers.length) {
          this.customers = [...this.customers, ...customers];
        } else {
          this.noCustomerFound = true;
        }
      },
      error: (error) => {
        this.noCustomerFound = true;
        const errorMessage = this.utilsService.handleErrorMessage(error);
        this.snackBarService.openSnackBar(errorMessage, 'close');
      }
    }

    await this.customerService.getCustomers(this.pageNumber)
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
          this.customers = [];
          this.loadCustomers();
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

  openRemoveCustomer(customer: Customer) {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: customer,
      autoFocus: false,
      disableClose: true,
      panelClass: 'es-small-dialog'
    });

    this.confirmDialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.removeCustomer(customer);
      }
    });
  }

  async removeCustomer(customer: Customer) {

    const removedCustomerResponse = {
      next: () => {
        this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_REMOVED, 'close');
        this.customers = [];
        this.loadCustomers();
      },
      error: (error) => {
        const message = this.utilsService.handleErrorMessage(error);
        this.snackBarService.openSnackBar(message, 'close');
      }
    }

    await this.customerService.removeCustomer(customer.id)
      .pipe(tap(removedCustomerResponse))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  onScroll() {
      this.pageNumber += 1;
      this.loadCustomers();   
  }
}
