import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { Address } from 'src/app/core/models/address/address.model';
import { CreditCard } from 'src/app/core/models/credit-card/credit-card.model';
import { Order } from 'src/app/core/models/order/order.model';
import { OrderItem } from 'src/app/core/models/orderItem/order-item.model';
import { AddressService } from 'src/app/core/service/address/address.service';
import { CreditCardService } from 'src/app/core/service/credit-card/credit-card.service';
import { OrderItemService } from 'src/app/core/service/order-item/order-item.service';
import { ProductService } from 'src/app/core/service/product/product.service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';

@Component({
  selector: 'es-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
  providers: [OrderItemService, ProductService, UtilsService, SnackbarService, AddressService, CreditCardService]
})
export class OrderDetailComponent implements OnInit {

  order: Order;
  orderItems: OrderItem[] = [];
  addresses: Address[] = [];
  creditCards: CreditCard[] = [];
  customerId: string = null;

  purchaseForm: FormGroup;
  showForm: boolean = false;

  constructor(
    private addressService: AddressService,
    private creditCardService: CreditCardService,
    private utilsService: UtilsService,
    private snackBarService: SnackbarService,
    private orderItemService: OrderItemService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  async ngOnInit() {
    this.initializeComponentDetail();
    this.createPurchaseForm();
    await this.loadOrderItems();
    await this.loadUserAddresses();
    await this.loadUserCreditCards();
  }

  createPurchaseForm() {
    this.purchaseForm = this.formBuilder.group({
      addressId: [null, [Validators.required]],
      creditCardId: [null, [Validators.required]]
    });
  }

  async loadUserCreditCards() {
    const creditCardsReceived = {
      next: (creditCards: CreditCard[]) => {
        if (creditCards.length) {
          this.creditCards = creditCards;
        }
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
      }
    };

    await this.creditCardService.getCreditCards()
    .pipe(tap(creditCardsReceived))
    .toPromise()
    .then(() => true)
    .catch(() => false);
  }

  async loadUserAddresses() {
    const addressesReceived = {
      next: (addresses: Address[]) => {
        if (addresses.length) {
          this.addresses = addresses;
        }
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
      }
    };
  
    await this.addressService.getAddresses()
      .pipe(tap(addressesReceived))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  initializeComponentDetail() {
    this.order = this.data['order'];
  }

  async loadOrderItems() {
    const orderItemsReceived = {
      next: (orderItems: OrderItem[]) => {
        if(orderItems.length) {
          this.orderItems = orderItems;
        }
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
      }
    };

    await this.orderItemService.getOrderItems(this.order['id'])
      .pipe(tap(orderItemsReceived))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  openPurchaseForm() {
    this.showForm = true;      
  }

  get addressId() {
    return this.purchaseForm.get('addressId');
  }

  get creditCardId() {
    return this.purchaseForm.get('creditCardId');
  }
}
