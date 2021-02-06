import { Injectable } from '@angular/core';

@Injectable()
export class ProductCategoryServiceMock {
  constructor() {}

  getProductCategories() {
    return [
      {
        id: 1,
        name: 'Sala',
      },
      {
        id: 21,
        name: 'Quarto',
      },
    ];
  }
}
