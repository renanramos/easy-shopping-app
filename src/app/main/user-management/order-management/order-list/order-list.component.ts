import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Order } from 'src/app/core/models/order/order.model';
import { OrderService } from 'src/app/core/service/order/order.service';
import { ConstantMessages } from 'src/app/core/shared/constants/constant-messages';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { OrderDetailComponent } from '../order-detail/order-detail.component';

@Component({
  selector: 'es-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  providers: [OrderService]
})
export class OrderListComponent implements OnInit {

  @Input() shouldUpdateList: Observable<any>;
  updateListSubscription: Subscription;

  orders: Order[] = [];
  displayedColumns: string[] = ["orderNumber", "finished", "options"];

  dialogOrderItemsRef: MatDialogRef<OrderDetailComponent>;

  constructor(
    private snackBarService: SnackbarService,
    private utilsService: UtilsService,
    private orderService: OrderService,
    private dialog: MatDialog) { }

  async ngOnInit() {
    this.subscribeToUpdateList();
    await this.loadOrderItems();
  }

  subscribeToUpdateList() {
    this.updateListSubscription = this.shouldUpdateList.subscribe(() => this.loadOrderItems());
  }

  ngOnDestroy() {
    this.updateListSubscription &&
      this.updateListSubscription.unsubscribe;
  }
  
  async loadOrderItems() {  
    const ordersReceived = {
      next: (orders: Order[]) => {
        this.orders = orders;
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
      }
    };

    await this.orderService.getOrders()
      .pipe(tap(ordersReceived))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  viewOrderItems(order: Order) {
    this.dialogOrderItemsRef = this.dialog.open(OrderDetailComponent, {
      data: { order },
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-dialog'
    });

    const afterOrderDialogClosed = {
      next: (addressUpdated) => {
        if (addressUpdated) {
          this.loadOrderItems();
          this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_UPDATED, 'close');
        }
      }
    }

    this.dialogOrderItemsRef.afterClosed().subscribe(afterOrderDialogClosed);
  }
}
