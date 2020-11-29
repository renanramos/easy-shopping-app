import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../../models/order/order.model';
import { ApiService } from '../api.service';

@Injectable()
export class OrderService extends ApiService<Order> {

  private url: string = '/orders';

  constructor(injector: Injector) {
    super(injector);
  }

  saveOrder(order: Order) : Observable<Order> {
    return this.post(`${this.url}`, order);
  }

  getOrders() : Observable<Order | Order[]> {
    return this.get(`${this.url}`);
  }
}