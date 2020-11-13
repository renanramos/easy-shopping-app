import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { StockItem } from '../../models/stock-item/stock-item.model';
import { Stock } from '../../models/stock/stock.model';
import { ApiService } from '../api.service';


@Injectable()
export class StockItemService extends ApiService<StockItem>{

  private url: string = "/stock-items";

  constructor(injector: Injector) {
    super(injector);
  }

  saveStockItems(stockItem: StockItem): Observable<StockItem> {
    return this.post(`${this.url}`, stockItem);
  }

  getStockItems(stockId: number, pageNumber?: number, filterName?: string, noLimit?: boolean): Observable<StockItem | StockItem[]> {
    let filter = '';

    if (stockId) {
      filter += `?stockId=${stockId}`
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

  updateStockItem(stockItem: StockItem): Observable<StockItem> {
    return this.patch(`${this.url}/${stockItem['id']}`, stockItem);
  }
}