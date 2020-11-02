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
import { CreditCardDetailComponent } from '../credit-card-management/credit-card-detail/credit-card-detail.component';
import { CustomerFormComponent } from './customer-profile/customer-form.component';
import { ConstantMessages } from 'src/app/core/shared/constants/constant-messages';
import { UserRolesConstants } from 'src/app/core/shared/constants/user-roles-constants';
import { CompanyFormComponent } from './company-profile/company-form.component';

@Component({
  selector: 'es-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [CustomerService]
})
export class UserProfileComponent implements OnInit {

  currentCustomerId: string = null;
  customer: Customer;
  addresses: Address[] = [];
  updateAddressSubject: Subject<any> = new Subject<any>();
  updateCreditCardSubject: Subject<any> = new Subject<any>();
  currentUsername: string = '';
  currentUserEmail: string = '';
  currentUserCompleteName: string = '';
  currentUserRole: string = '';

  dialogAddressRef: MatDialogRef<AddressDetailComponent>;
  dialogCreditCardRef: MatDialogRef<CreditCardDetailComponent>;
  dialogCustomerProfile: MatDialogRef<CustomerFormComponent>;
  dialogCompanyProfile: MatDialogRef<CompanyFormComponent>;

  constructor(
    private dialog: MatDialog,
    private snackBarService: SnackbarService,
    private securityUserService: SecurityUserService) { }

  async ngOnInit() {
    this.loadUserLoggedInfo();
  }

  loadUserLoggedInfo() {
    this.currentCustomerId = this.securityUserService.userLoggedId;
    this.currentUsername = this.securityUserService.userLoggedUsername;
    this.currentUserEmail = this.securityUserService.userLoggedEmail;
    this.currentUserCompleteName = this.securityUserService.userName;
    this.currentUserRole = this.securityUserService.userLoggedRole;
  }

  addNewAddress(event: any) {
    event.stopPropagation();
    this.dialogAddressRef = this.dialog.open(AddressDetailComponent, {
      data: { customerId: this.currentCustomerId },
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

  addNewCreditCard(event: any) {
    event.stopPropagation();
    this.dialogCreditCardRef = this.dialog.open(CreditCardDetailComponent, {
      data: { customerId: this.currentCustomerId },
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-dialog'
    });

    const dialogResponse = {
      next: (response) => {
        if (response) {
          this.updateCreditCardSubject.next();
        }
      }
    };

    this.dialogCreditCardRef.afterClosed().subscribe(dialogResponse);
  }

  openProfileForm() {
    this.currentUserRole === UserRolesConstants.CUSTOMER ?
      this.openCustomerProfileForm() :
      this.openCompanyProfileForm();
  }

  openCustomerProfileForm() {
    this.dialogCustomerProfile = this.dialog.open(CustomerFormComponent, {
      data: { customerId: this.currentCustomerId },
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-dialog'
    });

    this.dialogCustomerProfile.afterClosed()
      .subscribe(response => {
        if (response) {
          this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_UPDATED, 'close');
        }
      })
  }

  openCompanyProfileForm() {
    this.dialogCompanyProfile = this.dialog.open(CompanyFormComponent, {
      data: { customerId: this.currentCustomerId },
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-dialog'
    });

    this.dialogCompanyProfile.afterClosed()
      .subscribe(response => {
        if (response) {
          this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_UPDATED, 'close');
        }
      })
  }
}
