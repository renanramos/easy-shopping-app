import { ApiService } from '../api.service';
import { Subcategory } from '../../models/subcategory/subcategory.model';
import { Injector, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class SubcategoryService  extends ApiService<Subcategory> {
  private url: string = '/subcategories';

  constructor(injector: Injector) {
    super(injector);
   }

   getSubcategories(productCategoryId: number): Observable<Subcategory | Subcategory[]> {
    return this.get(`${this.url}?productCategoryId=${productCategoryId}`);
   }
}