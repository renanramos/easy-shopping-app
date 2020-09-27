import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductImage } from '../../models/product-image/product-image.model';
import { ApiService } from '../api.service';

@Injectable()
export class ProductImageService extends ApiService<ProductImage>{
  
  private url: string = '/products';

  constructor(injector: Injector) {
    super(injector);
  }
  
  uploadImage(productImage: ProductImage): Observable<any> {
    return this.post(`${this.url}/images/${productImage['productId']}/upload`, productImage);
   }
}