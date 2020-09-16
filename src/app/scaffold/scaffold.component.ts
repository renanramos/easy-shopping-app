import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ProductCategoryService } from '../core/service/productCategory/product-category.service';
import { ProductCategory } from '../core/models/product-category/product-category.model';
import { SubcategoryService } from '../core/service/subcategory/subcategory.service';
import { Subcategory } from '../core/models/subcategory/subcategory.model';
import { MenuService } from '../core/shared/service/menu-service.service';
import { UtilsService } from '../core/shared/utils/utils.service';

@Component({
  selector: 'es-scaffold',
  templateUrl: './scaffold.component.html',
  styleUrls: ['./scaffold.component.css'],
  providers: [ProductCategoryService, SubcategoryService]
})
export class ScaffoldComponent implements OnInit {

  userLoggedName: string = '';
  productsCategories: ProductCategory[] = [];
  subcategories: Subcategory[] = [];
  changeArrowIcon = true;

  @ViewChild('drawer', { static: true}) drawer: MatDrawer;

  constructor(
    private utilsService: UtilsService,
    private productCategoryService: ProductCategoryService,
    private subcategoryService: SubcategoryService,
    private menuService: MenuService,
    private snackBar: MatSnackBar,
    public router: Router) {
  }

  async ngOnInit() {
    this.drawer.open();
    await this.loadProductsCategories();
  }

  async loadProductsCategories() {
    const receivedProductsCategories = {
      next: (productsCategories: ProductCategory[]) => {
        if (productsCategories.length) {
          this.productsCategories = productsCategories;
          this.disableProductCategoryToShow();
        }
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBar.open(errorMessage,'close');
      }
    };

    await this.productCategoryService.getProductCategories()
      .pipe(tap(receivedProductsCategories))
      .toPromise()
      .then()
      .catch();
  }

  disableProductCategoryToShow(productCategory?: ProductCategory) {
    this.productsCategories.map(proCateg => {
      if (productCategory != proCateg) {
        proCateg.enabled = false;
        this.changeArrowIcon = true;
      }
    });
  }

  async getSubcategory(productCategory: ProductCategory) {
    console.log(this.changeArrowIcon, productCategory);
    this.changeArrowIcon = !this.changeArrowIcon;
    this.subcategories = [];
    await this.loadSubcategory(productCategory);
  }

  async loadSubcategory(productCategory: ProductCategory) {

    this.disableProductCategoryToShow(productCategory);
    productCategory.enabled = !productCategory.enabled;

    if (productCategory.enabled) {
      const receiveSubcategories = {
        next: (subcategories: Subcategory[]) => {
          this.subcategories = subcategories;
        },
        error: (response) => {
          const errorMessage = this.utilsService.handleErrorMessage(response);
          this.snackBar.open(errorMessage,'close');
        }
      };
  
      await this.subcategoryService.getSubcategories(productCategory.id)
      .pipe(tap(receiveSubcategories))
      .toPromise()
      .then()
      .catch();
    }    
  }

  subcategorySelected(sub: Subcategory) {
    this.menuService.setSubategory(sub);
  }

  handlerEventMenu($event) {
    this.drawer.toggle();
  }
}
