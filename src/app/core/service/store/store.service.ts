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

  getStores(companyId?: number): Observable<Store | Store[]> {

    let filter = '';

    if (companyId) {
      filter += `?companyId=${companyId}`
    }
    return this.get(`${this.url}${filter}`);
  }
  
  getCompanyOwnStores(): Observable<Store | Store[]> {
    return this.get(`${this.url}/company-stores`);
  }
}
