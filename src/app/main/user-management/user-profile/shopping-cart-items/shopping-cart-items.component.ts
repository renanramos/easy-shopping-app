import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { Address } from 'src/app/core/models/address/address.model';
import { CreditCard } from 'src/app/core/models/credit-card/credit-card.model';
import { Order } from 'src/app/core/models/order/order.model';
import { Product } from 'src/app/core/models/product/product.model';
import { AddressService } from 'src/app/core/service/address/address.service';
import { SecurityUserService } from 'src/app/core/service/auth/security-user.service';
import { CreditCardService } from 'src/app/core/service/credit-card/credit-card.service';
import { OrderItem } from 'src/app/core/models/orderItem/order-item.model';
import { ShoppingCartService } from 'src/app/core/service/shopping-cart/shopping-cart.service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { OrderItemService } from 'src/app/core/service/order-item/order-item.service';
import { OrderService } from 'src/app/core/service/order/order.service';

@Component({
  selector: 'es-shopping-cart-items',
  templateUrl: './shopping-cart-items.component.html',
  styleUrls: ['./shopping-cart-items.component.css'],
  providers: [ShoppingCartService, AddressService, CreditCardService, OrderItemService, OrderService]
})
export class ShoppingCartItemsComponent implements OnInit {

  order: Order = new Order();

  orderItem: OrderItem[] = [];
  orderItemForm: FormGroup;

  products: Product[] = [];
  addresses: Address[] = [];
  creditCards: CreditCard[] = [];

  constructor(private formBuilder: FormBuilder,
    private dialog: MatDialogRef<ShoppingCartItemsComponent>,
    private snackBarService: SnackbarService,
    private utilsService: UtilsService,
    private securityUserService: SecurityUserService,
    private shoppingCartService: ShoppingCartService,
    private addressService: AddressService,
    private creditCardService: CreditCardService,
    private orderItemService: OrderItemService,
    private orderService: OrderService) { }

  async ngOnInit() {
    this.initializeOrderProperties();
    this.getProductsFromCart();
  }

  async loadUserCrediCards() {
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
      error:(response) => {
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

  getProductsFromCart() {
    this.products = this.shoppingCartService.getProductsParsed();
  }

  initializeOrderProperties() {
    this.order['customerId'] = this.securityUserService.userLoggedId;
    this.order['orderNumber'] = this.orderNumber;
  }

  get cartTotal() {
    return this.products.length ? this.products.map(prod => prod['price']).reduce(this.totalPriceItems, 0) : 0;
  }

  totalPriceItems = (prevPrice, currentPrice) => (prevPrice + currentPrice);

  async saveOrder() {
    this.preparItemsBeforSubmit();
    await this.saveParentOrder();
  }

  async saveParentOrder() {
    const orderReceived = {
      next: (order: Order) => {
        if (order['id']) {
          this.submitOrderItems(order);
        }
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
      }
    };
  
    await this.orderService.saveOrder(this.order)
      .pipe(tap(orderReceived))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  preparItemsBeforSubmit() {
    this.products.map(product => {
      this.orderItem.push({
        orderId: this.order['id'],
        productId: product['id'],
        productName: product['name'],
        amount: 1,
        price: product['price'],
        total: product['price'] * 1
      });
    });
  }

  async submitOrderItems(order: Order) {
   for(let orderItem of this.orderItem) {
     orderItem['orderId'] = order['id'];
    await this.saveOrderItems(orderItem);
   }
  }

  async saveOrderItems(orderItem: OrderItem) {
    console.log(orderItem);
    const orderItemSaved = {
      next: (orderItem: OrderItem) => {
        this.dialog.close(orderItem);
      },
      error:(response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
      }
    };

    await this.orderItemService.saveOrderItem(orderItem)
      .pipe(tap(orderItemSaved))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
  
  get orderNumber() {
    return (Math.random() * 1000).toString();
  }
}
