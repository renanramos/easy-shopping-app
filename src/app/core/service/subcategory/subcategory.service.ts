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

   getSubcategories(pageNumber?: number, productCategoryId?: number, filter?: string, noLimitSize?: boolean): Observable<Subcategory | Subcategory[]> {
     let filterString = '';

     if (productCategoryId) {
       filterString += `?productCategoryId=${productCategoryId}`;
     }

     if (pageNumber) {
       filterString = filterString ? `&pageNumber=${pageNumber}` : `?pageNumber=${pageNumber}`;
     }

     if (noLimitSize) {
      filterString = '';
      filterString = `?pageSize=-1`;
     }

     if (filter) {
      filterString += filterString ? `&name=${filter}` : `?name=${filter}`;
     }
    return this.get(`${this.url}${filterString}`);
   }

   saveNewSubcategory(subcategory: Subcategory): Observable<Subcategory> {
     return this.post(`${this.url}`, subcategory);
   }

   updateSubcategory(subcategory: Subcategory): Observable<Subcategory> {
     return this.patch(`${this.url}/${subcategory['id']}`, subcategory);
   }

   removeSubcategory(subcategoryId: number): Observable<Subcategory> {
    return this.delete(`${this.url}/${subcategoryId}`);
   }
}