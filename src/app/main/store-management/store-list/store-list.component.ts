import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/core/service/store/store.service';
import { CompanyService } from 'src/app/core/service/company/company.service';
import { Store } from 'src/app/core/models/store/store.model';
import { Company } from 'src/app/core/models/registration/company.model';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { debounceTime, tap } from 'rxjs/operators';
import { SecurityUserService } from 'src/app/core/service/auth/security-user.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { StoreDetailComponent } from '../store-detail/store-detail.component';
import { ConstantMessages } from 'src/app/core/shared/constants/constant-messages';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { ScrollValues } from 'src/app/core/shared/constants/scroll-values';
import { SearchService } from 'src/app/core/shared/service/search-service';
import { Subscription } from 'rxjs';
import { UserRolesConstants } from 'src/app/core/shared/constants/user-roles-constants';

@Component({
  selector: 'es-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.css'],
  providers: [StoreService, CompanyService, SecurityUserService, UtilsService]

})
export class StoreListComponent implements OnInit {

  pageNumber: number = ScrollValues.DEFAULT_PAGE_NUMBER;
  noStoreFound: boolean = false;
  stores: Store[] = [];
  userId: number = null;
  isAdminUser: boolean = false;

  dialogRefStoreDetail: MatDialogRef<StoreDetailComponent>;
  dialogRefConfirm: MatDialogRef<ConfirmDialogComponent>;

  searchSubscription: Subscription;
  filterName: string = '';

  constructor(
    private snackBarService: SnackbarService,
    private utilsService: UtilsService,
    private securityUserService: SecurityUserService,
    private storeService: StoreService,
    private searchService: SearchService,
    private dialog: MatDialog) { }

  async ngOnInit() {
    this.isAdminUser = this.securityUserService.isAdminUser;
    this.subscribeToSearchService();
    await this.loadStores();
  }

  subscribeToSearchService() {
    this.searchSubscription = this.searchService.searchSubject$
    .subscribe((value) => {
      this.pageNumber = ScrollValues.DEFAULT_PAGE_NUMBER;
      this.filterName = value;
      this.stores = [];
      this.loadStores();
    });
  }

  async loadStores() {
    const receivedStores = {
      next: (stores: Store[]) => {
        if (stores.length) {
          this.stores = [...this.stores, ...stores];
        } else {
          this.noStoreFound = true;
        }
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
      }
    };

    if (this.securityUserService.userLoggedRole == UserRolesConstants.COMPANY) {
      await this.storeService.getCompanyOwnStores()
        .pipe(tap(receivedStores))
        .toPromise()
        .then(() => true)
        .catch(() => false);      
    } else {
      await this.storeService.getStores(null, this.pageNumber, this.filterName)
        .pipe(tap(receivedStores))
        .toPromise()
        .then(() => true)
        .catch(() => false);
    }
  }

  onScroll() {
    this.pageNumber += 1;
    this.loadStores();
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
          this.stores = [];
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
        this.stores = [];
        this.loadStores();
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
          this.stores = [];
          this.reloadListOfItens();
        }
      }
    };

    this.dialogRefStoreDetail.afterClosed()
    .subscribe(storeCreated);
  }

  reloadListOfItens() {
    this.pageNumber = ScrollValues.DEFAULT_PAGE_NUMBER;
    this.loadStores();
  }
}
