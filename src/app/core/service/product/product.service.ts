import { Injectable, Injector } from '@angular/core';
import { ApiService } from '../api.service';
import { Product } from '../../models/product/product.model';
import { Observable } from 'rxjs';

@Injectable()
export class ProductService extends ApiService<Product>{

  private url: string = '/products';

  constructor(injector: Injector) {
    super(injector);
   }

   getProducts(subcategoryId?:number): Observable<Product | Product[]> {
    let url = `${this.url}`;

    if (subcategoryId) {
      url += `/subcategory?subcategoryId=${subcategoryId}`;
    }
    return this.get(url);
   }
}
