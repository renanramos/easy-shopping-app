import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { PurchaseStatistic } from '../../models/purchase/purchase-statistic.model';
import { Purchase } from '../../models/purchase/purchase.model';
import { ApiService } from '../api.service';

@Injectable()
export class PurchaseService extends ApiService<Purchase>{

  private url: string = "/purchases";

  constructor(injector: Injector) {
    super(injector);
  }

  savePurchase(purchase: Purchase): Observable<Purchase> {
    return this.post(`${this.url}`, purchase);
  }

  getPurchaseStatistics() : Observable<any> {
    return this.get(`${this.url}/statistics`);
  }
}