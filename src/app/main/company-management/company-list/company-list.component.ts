import { Component, OnDestroy, OnInit } from '@angular/core';

import { CompanyService } from '../../../core/service/company/company.service';
import { Company } from '../../../core/models/registration/company.model';
import { SnackbarService } from '../../../core/shared/service/snackbar.service';
import { UtilsService } from '../../../core/shared/utils/utils.service';
import { tap } from 'rxjs/operators';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
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
export class CompanyListComponent implements OnInit, OnDestroy {

  pageNumber: number = ScrollValues.DEFAULT_PAGE_NUMBER;
  noCompanyFound: boolean = false;
  companies: Company[] = [];

  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  searchSubscription: Subscription;
  filterName: string = '';

  constructor(private companyService: CompanyService,
    private utilsService: UtilsService,
    private searchService: SearchService,
    private snackBarService: SnackbarService) { }

  async ngOnInit() {
    await this.loadCompanies();
    this.subscribeToSearchService();
  }

  ngOnDestroy(): void {
    this.searchSubscription &&
      this.searchSubscription.unsubscribe();
  }

  subscribeToSearchService() {
    this.searchSubscription = this.searchService.searchSubject$
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

  onScroll() {
    this.pageNumber += 1;
    this.loadCompanies();
  }

  reloadListOfItens() {
    this.pageNumber = ScrollValues.DEFAULT_PAGE_NUMBER;
    this.loadCompanies();
  }
}
