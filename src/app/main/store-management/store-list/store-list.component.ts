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
import { ConstantMessages } from 'src/app/core/shared/constants/constant-messages';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';

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
  isAdminUser: boolean = false;

  dialogRefStoreDetail: MatDialogRef<StoreDetailComponent>;
  dialogRefConfirm: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    private snackBarService: SnackbarService,
    private utilsService: UtilsService,
    private securityUserService: SecurityUserService,
    private storeService: StoreService,
    private companyService: CompanyService,
    private dialog: MatDialog) { }

  async ngOnInit() {
    this.userId = this.securityUserService.idUserLoggedIn;
    this.isAdminUser = this.securityUserService.isAdminUser;
    await this.initializeProperties();
  }

  async initializeProperties() {
   if (this.securityUserService.isAdminUser) {
      await this.loadStores();
      await this.loadCompanies();
   } else {
      await this.loadCompanyOwnStores();
   }     
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
        this.stores = stores;
        if (!this.stores.length) {
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

    await this.storeService.getCompanyOwnStores(this.userId)
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

    await this.companyService.getCompanies(null, true)
      .pipe(tap(receivedCompanies))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  onScroll() {
    console.log('scrolled');
  }

  openEditStore(store: Store) {
    this.dialogRefStoreDetail = this.dialog.open(StoreDetailComponent, {
      data: { store: store },
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-dialog'
    });

    const receivedStoreUpdated = {
      next: (storeUpdated) => {
        if (storeUpdated) {
          this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_UPDATED, 'close');
          this.reloadListOfItens();
        }
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
      }
    }

    this.dialogRefStoreDetail.afterClosed().subscribe(receivedStoreUpdated);
  }

  openRemoveStore(store: Store) {
    this.dialogRefConfirm = this.dialog.open(ConfirmDialogComponent, {
      data: store,
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-small-dialog'
    });

    const closedDialog = {
      next: (response) => {
        if (response) {
         this.removeStore(store.id);
        }
      }
    };

    this.dialogRefConfirm.afterClosed().subscribe(closedDialog);
  }

  async removeStore(storeId: number) {

    const removedStore = {
      next: (removedResponse) => {
        this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_REMOVED, 'close');
        this.initializeProperties();
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
      }
    };

    await this.storeService.removeStore(storeId)
      .pipe(tap(removedStore))
      .toPromise()
      .then(() => true)
      .catch(() => false);

  }

  onAddNewStore() {
    this.dialogRefStoreDetail = this.dialog.open(StoreDetailComponent, {
      data: { store: new Store()},
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-dialog'
    });

    const storeCreated = {
      next: (store) => {
        if (store['id']) {
          this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_CREATED, 'close');
          this.reloadListOfItens();
        }
      }
    };

    this.dialogRefStoreDetail.afterClosed()
    .subscribe(storeCreated);
  }

  reloadListOfItens() {
    this.loadCompanies();
    this.initializeProperties();
  }

  getCompanyNameById(companyId: number) {
    return this.companies.find(company => company['id'] == companyId)['name'];
  }
}
