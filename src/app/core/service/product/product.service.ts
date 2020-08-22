import { Injectable, Injector } from '@angular/core';
import { ApiService } from '../api.service';
import { Product } from '../../models/product/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends ApiService<Product>{

  private url: string = '/products';

  constructor(injector: Injector) {
    super(injector);
   }

   getProducts(): Observable<Product | Product[]> {
    return this.get(`${this.url}`);
   }
}
