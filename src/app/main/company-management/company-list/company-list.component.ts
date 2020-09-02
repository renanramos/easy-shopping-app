import { Component, OnInit } from '@angular/core';

import { CompanyService } from '../../../core/service/company/company.service';
import { Company } from '../../../core/models/registration/company.model';
import { SnackbarService } from '../../../core/shared/service/snackbar.service';
import { UtilsService } from '../../../core/shared/utils/utils.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'es-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css'],
  providers: [CompanyService]
})
export class CompanyListComponent implements OnInit {

  isLoadingCompanies: boolean = false;
  noCompanyFound: boolean = false;
  companies: Company[] = [];

  constructor(private companyService: CompanyService,
      private snackBarService: SnackbarService,
      private utilsService: UtilsService) { }

  async ngOnInit() {
    await this.loadCompanies();
  }

  async loadCompanies() {

    this.isLoadingCompanies = true;

    const receivedCompanies = {
      next: (companies: Company[]) => {
        if (companies.length) {
          this.companies = companies;
        } else {
          this.noCompanyFound = true;
        }
        this.isLoadingCompanies = false;
      },
      error: (response) => {
        this.isLoadingCompanies = false;
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
      }
    }

    await this.companyService.getCompanies()
      .pipe(tap(receivedCompanies))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  openEditCompany(company: Company) {
    console.log(company);
  }
}
