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

   getProductCategories(pageNumber: number, filterParameter?: string, noLimitSize?: boolean): Observable<ProductCategory | ProductCategory[]> {
    let filterString = '';

    if (pageNumber) {
      filterString += `?pageNumber=${pageNumber}`;
    }

    if (noLimitSize) {
      filterString = '';
      filterString += `?pageSize=-1`;
    }

    if (filterParameter) {
      filterString += filterString ? `&name=${filterParameter}` : `?name=${filterParameter}`;
    }

    return this.get(`${this.url}${filterString}`);
   }

   saveNewProductCategory(productCategory: ProductCategory): Observable<ProductCategory> {
     return this.post(`${this.url}`, productCategory);
   }

   updateProductCategory(productCategory: ProductCategory): Observable<ProductCategory> {
     return this.patch(`${this.url}/${productCategory['id']}`, productCategory);
   }

   removeProductCategory(productCategoryId: number): Observable<ProductCategory> {
     return this.delete(`${this.url}/${productCategoryId}`);
   }
}