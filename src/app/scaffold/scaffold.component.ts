import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ProductCategoryService } from '../core/service/productCategory/product-category.service';
import { ProductCategory } from '../core/models/product-category/product-category.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';
import { SubcategoryService } from '../core/service/subcategory/subcategory.service';
import { Subcategory } from '../core/models/subcategory/subcategory.model';
import { MenuService } from '../core/shared/service/menu-service.service';
import { Router } from '@angular/router';
import { ConstantMessages } from '../core/shared/constants/constant-messages';

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
  isLoadingCategories: boolean = false;

  @ViewChild('drawer', { static: true}) drawer: MatDrawer;

  constructor(private productCategoryService: ProductCategoryService,
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
    this.isLoadingCategories = true;
    const receivedProductsCategories = {
      next: (productsCategories: ProductCategory[]) => {
        if (productsCategories.length) {
          this.productsCategories = productsCategories;
          this.disableProductCategoryToShow();
        }
        this.isLoadingCategories = false;
      },
      error: () => {
        this.snackBar.open(ConstantMessages.CANT_GET_PRODUCT_CATEGORIES);
        this.isLoadingCategories = true;
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
    this.changeArrowIcon = !this.changeArrowIcon;
    await this.loadSubcategory(productCategory);
  }

  async loadSubcategory(productCategory: ProductCategory) {

    this.disableProductCategoryToShow(productCategory);
    productCategory.enabled = !productCategory.enabled;

    const receiveSubcategories = {
      next: (subcategories: Subcategory[]) => {
        this.subcategories = subcategories;
      },
      error: () => this.snackBar.open(ConstantMessages.CANT_GET_PRODUCT_CATEGORIES)
    };

    await this.subcategoryService.getSubcategories(productCategory.id)
    .pipe(tap(receiveSubcategories))
    .toPromise()
    .then()
    .catch();
  }

  subcategorySelected(sub: Subcategory) {
    this.menuService.setSubategory(sub);
  }

  handlerEventMenu($event) {
    this.drawer.toggle();
  }
}
