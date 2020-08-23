import { ApiService } from '../api.service';
import { Injectable, Injector } from '@angular/core';
import { ProductCategory } from '../../models/product-category/product-category.model';
import { Observable } from 'rxjs';

@Injectable()
export class ProductCategoryService extends ApiService<ProductCategory> {

  private url: string = '/product-categories';

  constructor(injector: Injector) {
    super(injector);
  }

   getProductCategories(): Observable<ProductCategory | ProductCategory[]> {
    return this.get(`${this.url}`);
   }
}