import { Component, OnInit } from '@angular/core';

import { CompanyService } from '../../../core/service/company/company.service';
import { Company } from '../../../core/models/registration/company.model';
import { SnackbarService } from '../../../core/shared/service/snackbar.service';
import { UtilsService } from '../../../core/shared/utils/utils.service';
import { debounceTime, tap } from 'rxjs/operators';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CompanyDetailComponent } from '../company-detail/company-detail.component';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { ConstantMessages } from 'src/app/core/shared/constants/constant-messages';
import { Subscription } from 'rxjs';
import { SearchService } from 'src/app/core/shared/service/search-service';
import { ScrollValues } from 'src/app/core/shared/constants/scroll-values';

@Component({
  selector: 'es-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css'],
  providers: [CompanyService]
})
export class CompanyListComponent implements OnInit {

  pageNumber: number = ScrollValues.DEFAULT_PAGE_NUMBER;
  noCompanyFound: boolean = false;
  companies: Company[] = [];
  
  dialogRef: MatDialogRef<CompanyDetailComponent>;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  searchSubscription: Subscription;
  filterName: string = '';

  constructor(private companyService: CompanyService,
    private utilsService: UtilsService,
    private dialog: MatDialog,
    private searchService: SearchService,
    private snackBarService: SnackbarService) { }

  async ngOnInit() {
    await this.loadCompanies();
    this.subscribeToSearchService();
  }

  subscribeToSearchService() {
    this.searchSubscription = this.searchService.searchSubject$
    .pipe(debounceTime(300))
    .subscribe((value) => {
      this.pageNumber = ScrollValues.DEFAULT_PAGE_NUMBER;
      this.filterName = value;
      this.companies = [];
      this.loadCompanies();
    })
  }

  async loadCompanies() {

    const receivedCompanies = {
      next: (companies: Company[]) => {
        if (companies.length) {
          this.companies = [...this.companies, ...companies];
        } else {
          this.noCompanyFound = true;
        }
      },
      error: (response) => {
        this.noCompanyFound = true;
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
      }
    }

    await this.companyService.getCompanies(null, this.pageNumber, this.filterName)
      .pipe(tap(receivedCompanies))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  openEditCompany(company: Company) {

    const receivedDialogResponse = {
      next: (companyUpdated) => {
        if(companyUpdated) {
          this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_UPDATED);
          this.companies = [];
          this.loadCompanies();
        }
      }
    }

    this.dialogRef = this.dialog.open(CompanyDetailComponent, {
      data: { company: company },
      autoFocus: false,
      disableClose: true,
      panelClass: 'es-dialog'
    });

    this.dialogRef.afterClosed().subscribe(receivedDialogResponse);
  }

  openRemoveCompany(company: Company) {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: company,
      autoFocus: false,
      disableClose: true,
      panelClass: 'es-small-dialog'
    });

    this.confirmDialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.removeCompany(company);
      }
    });
  }

  async removeCompany(company: Company) {

    const removedCustomerResponse = {
      next: () => {
        this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_REMOVED, 'close');
        this.companies = [];
        this.loadCompanies();
      },
      error: (error) => {
        const message = this.utilsService.handleErrorMessage(error);
        this.snackBarService.openSnackBar(message, 'close');
      }
    };

    await this.companyService.removeCompany(company['id'])
      .pipe(tap(removedCustomerResponse))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  onScroll() {
    this.pageNumber += 1;
    this.loadCompanies();
  }
}
