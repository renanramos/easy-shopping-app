import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { Order } from 'src/app/core/models/order/order.model';
import { OrderItem } from 'src/app/core/models/orderItem/order-item.model';
import { OrderItemService } from 'src/app/core/service/order-item/order-item.service';
import { ProductService } from 'src/app/core/service/product/product.service';

@Component({
  selector: 'es-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
  providers: [OrderItemService, ProductService]
})
export class OrderDetailComponent implements OnInit {

  order: Order;
  orderItems: OrderItem[] = [];

  constructor(
    private orderItemService: OrderItemService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  async ngOnInit() {
    this.initializeComponentDetail();
    await this.loadOrderItems();
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
        console.log(response);
      }
    };

    await this.orderItemService.getOrderItems(this.order['id'])
      .pipe(tap(orderItemsReceived))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

}
