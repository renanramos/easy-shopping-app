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

   getProducts(subcategoryId?:number, published?: boolean, storeId?: number, pageNumber?: number, filterName?: string ): Observable<Product | Product[]> {
    let filterString = ``;

    if (subcategoryId) {
      filterString += `/subcategory?subcategoryId=${subcategoryId}`;
    }

    if (published) {
      filterString += filterString ? `&published=${published}` : `?published=${published}`;
    }

    if (storeId) {
      filterString += filterString ? `&storeId=${storeId}` : `?storeId=${storeId}`;
    }
  
    if(pageNumber) {
      filterString += filterString ? `&pageNumber=${pageNumber}` : `?pageNumber=${pageNumber}`;
    }

    if(filterName) {
      filterString += filterString ? `&name=${filterName}` : `?name=${filterName}`;
    }

    return this.get(`${this.url}${ filterName ? '/search' : ''}${filterString}`);
   }

   saveProduct(product: Product): Observable<Product> {
     return this.post(`${this.url}`, product);
   }

   updateProduct(product: Product): Observable<Product> {
     return this.patch(`${this.url}/${product['id']}`, product);
   }

   removeProduct(productId: number): Observable<Product> {
     return this.delete(`${this.url}/${productId}`);
   }

   publishProduct(product: Product): Observable<Product> {
    return this.patch(`${this.url}/publish/${product['id']}`, product);
   }
}
