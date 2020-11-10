import { Inject, Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { Stock } from '../../models/stock/stock.model';
import { ApiService } from '../api.service';

@Injectable()
export class StockService extends ApiService<Stock> {
  
  private url: string = '/stocks';
  
  constructor(injector: Injector) {
    super(injector);
  }

  saveStock(stock: Stock): Observable<Stock> {
    return this.post(this.url, stock);
  }

  getStocks(storeId?: number, pageNumber?: number, filterName?: string, noLimit?: boolean): Observable<Stock | Stock[]> {
    let filter = '';

    if (storeId) {
      filter += `?companyId=${storeId}`
    }

    if (filterName) {
      filter += filter ? `&name=${filterName}` : `?name=${filterName}`;
    }

    if (pageNumber && !noLimit) {
      filter += filter ? `&pageNumber=${pageNumber}` : `?pageNumber=${pageNumber}`;
    }

    if (noLimit) {
      filter += filter ? `&pageSize=-1` : ``;
    }

    return this.get(`${this.url}${filter}`);
  }

  getStockById(stockId: number): Observable<Stock | Stock[]> {
    return this.get(`${this.url}/${stockId}`);
  }

  updateStock(stock: Stock): Observable<Stock> {
    return this.patch(`${this.url}/${stock.id}`, stock);
  }
}