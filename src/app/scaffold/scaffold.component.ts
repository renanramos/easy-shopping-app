import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ProductCategoryService } from '../core/service/productCategory/product-category.service';
import { ProductCategory } from '../core/models/product-category/product-category.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';
import { SubcategoryService } from '../core/service/subcategory/subcategory.service';
import { Subcategory } from '../core/models/subcategory/subcategory.model';

@Component({
  selector: 'es-scaffold',
  templateUrl: './scaffold.component.html',
  styleUrls: ['./scaffold.component.css'],
  providers: [ProductCategoryService, SubcategoryService]
})
export class ScaffoldComponent implements OnInit {

  productsCategories: ProductCategory[] = [];
  subcategories: Subcategory[] = [];

  @ViewChild('drawer', { static: true}) drawer: MatDrawer;

  constructor(private productCategoryService: ProductCategoryService,
    private subcategoryService: SubcategoryService,
    private snackBar: MatSnackBar) {
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
        } else {
          this.snackBar.open('Não há categorias de produtos cadastradas.');
        }
      },
      error: () => this.snackBar.open('Não foi possível carregar as categorias dos produtos.')
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
      }
    });
  }

  async getSubcategory(productCategory: ProductCategory) {
    await this.loadSubcategory(productCategory);
  }

  async loadSubcategory(productCategory: ProductCategory) {

    // productCategory = this.handleOpenedAndClosedSubcategories(productCategory);
    this.disableProductCategoryToShow(productCategory);
    productCategory.enabled = !productCategory.enabled;

    const receiveSubcategories = {
      next: (subcategories: Subcategory[]) => {
        this.subcategories = subcategories;
      },
      error: () => this.snackBar.open('Não foi possível buscar subcategorias.')
    };

    await this.subcategoryService.getSubcategories(productCategory.id)
    .pipe(tap(receiveSubcategories))
    .toPromise()
    .then()
    .catch();
  }
}
