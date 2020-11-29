import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderItem } from '../../models/orderItem/order-item.model';
import { ApiService } from '../api.service';


@Injectable()
export class OrderItemService extends ApiService<OrderItem> {

  private url: string = '/order-items';

  constructor(injector: Injector) {
    super(injector);
  }

  saveOrderItem(orderItem: OrderItem) :Observable<OrderItem> {
    return this.post(this.url, orderItem);
  }

  getOrderItems(orderId: number) : Observable<OrderItem | OrderItem[]> {
    return this.get(`${this.url}/${orderId}`);
  }
}