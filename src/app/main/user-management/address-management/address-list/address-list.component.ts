import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AddressService } from 'src/app/core/service/address/address.service';
import { Address } from 'src/app/core/models/address/address.model';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { tap } from 'rxjs/internal/operators/tap';
import { Subject, Observable, Subscription } from 'rxjs';
import { AddressDetailComponent } from '../address-detail/address-detail.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConstantMessages } from 'src/app/core/shared/constants/constant-messages';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'es-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.css'],
  providers: [AddressService]
})
export class AddressListComponent implements OnInit, OnDestroy {
  
  @Input() shouldUpdateList: Observable<any>;
  updateListSubscription: Subscription;

  dialogAddressDetailRef: MatDialogRef<AddressDetailComponent>;
  dialogConfirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  isLoadingAddresses: boolean = false;
  addresses: Address[] = [];
  displayedColumns: string[] = ["cep", "city", "district", "number", "state", "streetName", "options"];

  constructor(
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private snackBarService: SnackbarService,
    private addressService: AddressService) { }

  async ngOnInit() {
    this.subscribeToUpdateList();
    await this.loadAddress();
  }

  subscribeToUpdateList() {
    this.updateListSubscription = this.shouldUpdateList.subscribe(() => this.loadAddress());
  }

  ngOnDestroy() {
    this.updateListSubscription &&
      this.updateListSubscription.unsubscribe();
  }

  async loadAddress() {
    this.isLoadingAddresses = true;
    const receivedAddresses = {
      next: (addresses: Address[]) => {
        this.addresses = addresses;
        this.isLoadingAddresses = false;
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
        this.isLoadingAddresses = false;
      }
    };

    await this.addressService.getAddresses()
      .pipe(tap(receivedAddresses))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  editAddress(address: Address) {
    this.dialogAddressDetailRef = this.dialog.open(AddressDetailComponent, {
      data: { address: address },
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-dialog'
    });

    const afterUpdateAddress = {
      next: (addressUpdated) => {
        if (addressUpdated) {
          this.loadAddress();
          this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_UPDATED, 'close');
        }
      }
    }

    this.dialogAddressDetailRef.afterClosed().subscribe(afterUpdateAddress);
  }

  removeAddress(address: Address) {
    this.dialogConfirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { name: 'endereço'},
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-small-dialog'
    });

    const afterConfirmDialog = {
      next: (response) => {
        if (response) {
          this.deleteAddress(address);
        }
      }
    };

    this.dialogConfirmDialogRef.afterClosed().subscribe(afterConfirmDialog);
  }

  async deleteAddress(address: Address) {
    const addressRemoved = {
      next: (respone) => {
        this.loadAddress();
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
      }
    };

    await this.addressService.removeAddress(address['id'])
      .pipe(tap(addressRemoved))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
