import { ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { SecurityUserService } from 'src/app/core/service/auth/security-user.service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { Customer } from 'src/app/core/models/registration/customer.model';
import { tap } from 'rxjs/operators';
import { Address } from 'src/app/core/models/address/address.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddressDetailComponent } from '../address-management/address-detail/address-detail.component';
import { CustomerService } from 'src/app/core/service/customer/customer.service';
import { Subject, Subscription } from 'rxjs';
import { CreditCardDetailComponent } from '../credit-card-management/credit-card-detail/credit-card-detail.component';
import { CustomerFormComponent } from './customer-profile/customer-form.component';
import { ConstantMessages } from 'src/app/core/shared/constants/constant-messages';
import { UserRolesConstants } from 'src/app/core/shared/constants/user-roles-constants';
import { CompanyFormComponent } from './company-profile/company-form.component';
import { ShoppingCartService } from 'src/app/core/service/shopping-cart/shopping-cart.service';
import { Product } from 'src/app/core/models/product/product.model';
import { ShoppingCartItemsComponent } from './shopping-cart-items/shopping-cart-items.component';
import { Order } from 'src/app/core/models/order/order.model';
import { OrderService } from 'src/app/core/service/order/order.service';
import { MatSelectionListChange } from '@angular/material/list';
import { AlertDialogComponent } from 'src/app/core/shared/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'es-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [CustomerService, OrderService]
})
export class UserProfileComponent implements OnInit, OnDestroy, OnChanges {

  currentCustomerId: string = null;
  customer: Customer;
  addresses: Address[] = [];
  updateAddressSubject: Subject<any> = new Subject<any>();
  updateCreditCardSubject: Subject<any> = new Subject<any>();
  shoppingCartUpdated: Subject<any> = new Subject<any>();
  updateOrderSubject: Subject<any> = new Subject<any>();
  currentUsername: string = '';
  currentUserEmail: string = '';
  currentUserCompleteName: string = '';
  currentUserRole: string = '';
  products: Product[] = [];
  productsSelected: Product[] = [];
  order: Order;
  totalOrders: string = null;

  updateShoppingCartSubscription: Subscription;
  userUpdatedSubscription: Subscription;

  dialogAddressRef: MatDialogRef<AddressDetailComponent>;
  dialogCreditCardRef: MatDialogRef<CreditCardDetailComponent>;
  dialogCustomerProfile: MatDialogRef<CustomerFormComponent>;
  dialogCompanyProfile: MatDialogRef<CompanyFormComponent>;
  dialogShoppingCartItemstRef: MatDialogRef<ShoppingCartItemsComponent>;
  dialogAlertDialogRef: MatDialogRef<AlertDialogComponent>;
  hasSelectedItems: boolean;
  isUserSynchronized: boolean = false;

  constructor(
    private ref: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBarService: SnackbarService,
    private securityUserService: SecurityUserService,
    private shoppingCartService: ShoppingCartService) {
    }
  
  async ngOnInit() {
    this.loadUserLoggedInfo();
    this.subscribeToShoppingCartUpdates();
    this.subscribeToUserUpdate();
    await this.getUserItemsInCart();
    this.verifyUserCheckoutItems();
  }

  verifyUserCheckoutItems() {
    if (history.state['openDialog'] && this.isCustomerUser) {
      this.handleProductsSelected();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.ref.detectChanges();
  }

  ngOnDestroy(): void {
    this.updateShoppingCartSubscription
      && this.updateShoppingCartSubscription.unsubscribe();
    this.userUpdatedSubscription
      && this.userUpdatedSubscription.unsubscribe();
  }

  subscribeToShoppingCartUpdates() {
    this.updateShoppingCartSubscription = this.shoppingCartService.shoppingCartUpdated$.subscribe((productRemoved) => {
      let index = this.shoppingCartService.getProductIndexToRemove(productRemoved, this.products);
      this.products = this.products.splice(index, 1);
    })
  }

  async getUserItemsInCart() {
    this.products = await this.shoppingCartService.getProductsParsed();
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
    this.isCustomerUser ?
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
      .subscribe(userUpdated => {
        if (userUpdated) {
          this.securityUserService.userUpdated.next(userUpdated['sync']);
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
      .subscribe(userUpdated => {
        if (userUpdated) {
          this.securityUserService.userUpdated.next(userUpdated['sync']);
          this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_UPDATED, 'close');
        }
      });
  }

  removeItemsFromCart() {
    this.products.map(prod => this.shoppingCartService.removeItemFromShoppingCart(prod));
    this.shoppingCartUpdated.next(true);
    this.getUserItemsInCart();
    this.productsSelected = [];
  }

  get isCustomerUser() {
    return this.currentUserRole == UserRolesConstants.CUSTOMER;
  }

  async handleProductsSelected() {
    this.isUserSynchronized ?
    this.openShoppingCartCheckout() :
    this.openAlertDialog();
  }

  openAlertDialog() {
    this.dialogAlertDialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        message: "Você precisa atualizar seus dados antes de prosseguir."
      },
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-dialog'
    });
  
    this.dialogAlertDialogRef.afterClosed()
      .subscribe((response) => {
        if (response) {
          this.openProfileForm();
        }
      });
  }

  async openShoppingCartCheckout() {
    this.dialogShoppingCartItemstRef = this.dialog.open(ShoppingCartItemsComponent, {
      data: { 
        order: this.order
      },
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-dialog'
    });

    const orderDialogClosed = {
      next: (res) => {
        if (res) {
          this.updateOrderSubject.next();
          this.shoppingCartService.clearShoppingCart();
          this.getUserItemsInCart();
          this.shoppingCartUpdated.next(true);
          this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_CREATED);
        }
      }
    }

    await this.dialogShoppingCartItemstRef.afterClosed()
      .pipe(tap(orderDialogClosed))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  viewSelected(event: MatSelectionListChange) {
    this.hasSelectedItems = event.option.selectionList.selectedOptions.hasValue();
  }

  subscribeToUserUpdate() {
    this.userUpdatedSubscription = this.securityUserService.userUpdated$.subscribe((isUpdated) => {
      this.isUserSynchronized = isUpdated;
    });
  }

  setTotalOpenOrders(event) {
    this.totalOrders = event ? `${event}`: '';
  }
}
