import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subcategory } from '../../models/subcategory/subcategory.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private subcategoryFilter = new BehaviorSubject(new Subcategory());
  currentSubcategoryId = this.subcategoryFilter.asObservable();

  constructor() { }

  setSubategory(subcategory: Subcategory) {
    this.subcategoryFilter.next(subcategory);
  }
}