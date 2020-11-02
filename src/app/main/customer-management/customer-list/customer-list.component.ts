import { Component, OnDestroy, OnInit } from '@angular/core';

import { CustomerService } from 'src/app/core/service/customer/customer.service';
import { Customer } from 'src/app/core/models/registration/customer.model';
import { debounce, debounceTime, tap } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { ConstantMessages } from 'src/app/core/shared/constants/constant-messages';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { ScrollValues } from 'src/app/core/shared/constants/scroll-values';
import { SearchService } from 'src/app/core/shared/service/search-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'es-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  providers: [CustomerService]
})
export class CustomerListComponent implements OnInit, OnDestroy {

  selector: string = '.main-container';
  noCustomerFound: boolean = false;
  customers: Customer[] = [];
  pageNumber: number = ScrollValues.DEFAULT_PAGE_NUMBER;

  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  searchServiceSubscription: Subscription;
  filterName: string = '';

  constructor(private customerService: CustomerService,
    private utilsService: UtilsService,
    private dialog: MatDialog,
    private snackBarService: SnackbarService,
    private searchService: SearchService) { }

  async ngOnInit() {
    await this.loadCustomers();
    this.subscribeToSearchService();
  }

  ngOnDestroy(): void {
    this.searchServiceSubscription &&
      this.searchServiceSubscription.unsubscribe();
  }

  subscribeToSearchService() {
    this.searchServiceSubscription = this.searchService.searchSubject$
    .subscribe((value) => {
        this.pageNumber = ScrollValues.DEFAULT_PAGE_NUMBER;
        this.filterName = value;
        this.customers = [];
        this.loadCustomers();
      });
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

    await this.customerService.getCustomers(this.pageNumber, ScrollValues.DEFAULT_PAGE_SIZE, this.filterName)
      .pipe(tap(receivedCustomers))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  onScroll() {
    this.pageNumber += 1;
    this.loadCustomers();
  }
}
