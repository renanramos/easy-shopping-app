import { Component, OnInit } from '@angular/core';
import { UserAuthService } from 'src/app/core/service/auth/user-auth-service.service';
import { SecurityUserService } from 'src/app/core/service/auth/security-user.service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { Customer } from 'src/app/core/models/registration/customer.model';
import { tap } from 'rxjs/operators';
import { Address } from 'src/app/core/models/address/address.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddressDetailComponent } from '../address-management/address-detail/address-detail.component';
import { CustomerService } from 'src/app/core/service/customer/customer.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'es-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [CustomerService]
})
export class UserProfileComponent implements OnInit {

  currentUserId: number = null;
  customer: Customer;
  addresses: Address[] = [];
  updateAddressSubject: Subject<any> = new Subject<any>();

  dialogAddressRef: MatDialogRef<AddressDetailComponent>;

  constructor(
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private customerService: CustomerService,
    private snackBarService: SnackbarService,
    private securityUserService: SecurityUserService) { }

  async ngOnInit() {
    this.currentUserId = this.securityUserService.idUserLoggedIn;
    await this.loadUserLoggedInfo();
  }
  
  async loadUserLoggedInfo() {

    const receivedUserInfo = {
      next: (customerReceived: Customer) => {
        this.customer = customerReceived;
        this.addresses = this.customer.address ? this.customer.address : [];
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
      }
    };

    await this.customerService.getCustomerById(this.currentUserId)
      .pipe(tap(receivedUserInfo))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  addNewAddress(event: any) {
    event.stopPropagation();
    this.dialogAddressRef = this.dialog.open(AddressDetailComponent, {
      data: { customerId: this.customer['id'] },
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-dialog'
    });

    const dialogResponse = {
      next: (response) => {
        if (response) {
          this.updateAddressSubject.next();
        }
      }
    };

    this.dialogAddressRef.afterClosed().subscribe(dialogResponse);
  }
}
