import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/core/service/store/store.service';
import { CompanyService } from 'src/app/core/service/company/company.service';
import { Store } from 'src/app/core/models/store/store.model';
import { Company } from 'src/app/core/models/registration/company.model';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { tap } from 'rxjs/operators';
import { SecurityUserService } from 'src/app/core/service/auth/security-user.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { StoreDetailComponent } from '../store-detail/store-detail.component';

@Component({
  selector: 'es-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.css'],
  providers: [StoreService, CompanyService, SecurityUserService, UtilsService]

})
export class StoreListComponent implements OnInit {

  isLoadingStores: boolean = false;
  noStoreFound: boolean = false;
  stores: Store[] = [];
  companies: Company[] = [];
  userId: number = null;

  dialogRefStoreDetail: MatDialogRef<StoreDetailComponent>;

  constructor(
    private snackBarService: SnackbarService,
    private utilsService: UtilsService,
    private securityUserService: SecurityUserService,
    private storeService: StoreService,
    private companyService: CompanyService,
    private dialog: MatDialog) { }

  async ngOnInit() {
    this.userId = this.securityUserService.idUserLoggedIn;
    await this.loadStores();
    this.securityUserService.isAdminUser ?
      await this.loadCompanies() :
      await this.loadCompanyOwnStores();
  }

  async loadStores() {
    this.isLoadingStores = true;

    const receivedStores = {
      next: (stores: Store[]) => {
        if (stores.length) {
          this.stores = stores;
        } else {
          this.noStoreFound = true;
        }
        this.isLoadingStores = false;
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
        this.isLoadingStores = false;
      }
    };

    await this.storeService.getStores()
      .pipe(tap(receivedStores))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  async loadCompanyOwnStores() {
    this.isLoadingStores = true;

    const receivedStores = {
      next: (stores: Store[]) => {
        if (stores.length) {
          this.stores = stores;
        } else {
          this.noStoreFound = true;
        }
        this.isLoadingStores = false;
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
        this.isLoadingStores = false;
      }
    };

    await this.storeService.getCompanyOwnStores()
      .pipe(tap(receivedStores))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  async loadCompanies() {
    const receivedCompanies = {
      next: (companies: Company[]) => {
        if (companies.length) {
          this.companies = companies;
        }
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
      }
    };

    await this.companyService.getCompanies()
      .pipe(tap(receivedCompanies))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  onScroll() {
    console.log('scrolled');
  }

  openEditStore(store: Store) {
    
  }

  openRemoveStore(store: Store) {

  }

  onAddNewStore() {
    this.dialogRefStoreDetail = this.dialog.open(StoreDetailComponent, {
      data: { store: new Store()},
      disableClose: true,
      autoFocus: false,
    });
  }
}
