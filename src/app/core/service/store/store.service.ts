import { Injectable, Injector } from '@angular/core';
import { ApiService } from '../api.service';
import { Store } from '../../models/store/store.model';
import { Observable } from 'rxjs';

@Injectable()
export class StoreService extends ApiService<Store>{

  private url: string = '/stores';

  constructor(injector: Injector) {
    super(injector);
  }

  saveStore(store: Store): Observable<Store>{
    return this.post(this.url, store);
  }

  getStores(companyId?: number): Observable<Store | Store[]> {

    let filter = '';

    if (companyId) {
      filter += `?companyId=${companyId}`
    }
    return this.get(`${this.url}${filter}`);
  }

  udpateStore(store: Store): Observable<Store> {
    return this.patch(`${this.url}/${store.id}`, store);
  }

  getCompanyOwnStores(companyId: number): Observable<Store | Store[]> {
    return this.get(`${this.url}/company-stores?companyIdRequestParam=${companyId}`);
  }

  removeStore(storeId: number): Observable<any> {
    return this.delete(`${this.url}/${storeId}`);
  }
}
