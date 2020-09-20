import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { Admin } from 'src/app/core/models/admin/admin.model';
import { AdminService } from 'src/app/core/service/admin/admin.service';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { ConstantMessages } from 'src/app/core/shared/constants/constant-messages';
import { ScrollValues } from 'src/app/core/shared/constants/scroll-values';
import { SearchService } from 'src/app/core/shared/service/search-service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { AdminDetailComponent } from '../admin-detail/admin-detail.component';

@Component({
  selector: 'es-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.css'],
  providers: [AdminService]
})
export class AdminListComponent implements OnInit, OnDestroy {

  noAdministratorsFound: boolean = false;
  administrators: Admin[] = [];

  searchServiceSubscription: Subscription;
  pageNumber: number = ScrollValues.DEFAULT_PAGE_NUMBER;
  filterName: string = '';

  dialogRef: MatDialogRef<AdminDetailComponent>;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(private adminService: AdminService,
      private dialog: MatDialog,
      private searchService: SearchService,
      private snackBarService: SnackbarService,
      private utilsService: UtilsService) { }

  async ngOnInit() {
    await this.loadAdmins();
    this.subscribeToSearchService();
  }

  ngOnDestroy(): void {
    this.searchServiceSubscription &&
      this.searchServiceSubscription.unsubscribe();
  }

  subscribeToSearchService() {
    this.searchServiceSubscription = this.searchService.searchSubject$
    .pipe(debounceTime(300))
    .subscribe((value) => {
        this.pageNumber = ScrollValues.DEFAULT_PAGE_NUMBER;
        this.filterName = value;
        this.administrators = [];
        this.loadAdmins();
      });
  }

  async loadAdmins() {
    const receivedAdmins = {
      next: (administrators: Admin[]) => {
        console.log(administrators);
        if (administrators.length) {
          this.administrators = [...this.administrators, ...administrators];
        } else {
          this.noAdministratorsFound = true;
        }
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
        this.noAdministratorsFound;
      }
    };

    await this.adminService.getAdmins()
      .pipe(tap(receivedAdmins))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  onScroll() {
    this.pageNumber += 1;
    this.loadAdmins();
  }

  openEditAdmin(admin: Admin) {

    const receivedDialogResponse = {
      next: (adminUpdated) => {
        if (adminUpdated) {
          this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_UPDATED, 'close');
          this.administrators = [];
          this.loadAdmins();
        }
      }
    };

    this.dialogRef = this.dialog.open(AdminDetailComponent, {
      data: { admin: admin },
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-dialog'
    });

    this.dialogRef.afterClosed().subscribe(receivedDialogResponse);
  }

  openRemoveAdmin(admin: Admin) {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: admin,
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-small-dialog'
    });

    this.confirmDialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.removeAdministrator(admin);
      }
    });
  }

  async removeAdministrator(administrator: Admin) {
    const removedAdminResponse = {
      next: () => {
        this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_REMOVED, 'close');
        this.administrators = [];
        this.loadAdmins();
      },
      error: (error) => {
        const message = this.utilsService.handleErrorMessage(error);
        this.snackBarService.openSnackBar(message, 'close');
      }
    };

    await this.adminService.removeAdmin(administrator.id)
      .pipe(tap(removedAdminResponse))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  onAddNewStore() {
    this.dialogRef = this.dialog.open(AdminDetailComponent, {
      data: { admin: new Admin()},
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-dialog'
    });

    const adminCreated = {
      next: (admin: Admin) => {
        if (admin['id']) {
          this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_CREATED);
          this.administrators = [];
          this.loadAdmins();
        }
      }
    };

    this.dialogRef.afterClosed().subscribe(adminCreated);
  }
}
