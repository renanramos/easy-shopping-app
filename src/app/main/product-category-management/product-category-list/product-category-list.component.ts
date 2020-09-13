import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ProductCategory } from 'src/app/core/models/product-category/product-category.model';
import { SecurityUserService } from 'src/app/core/service/auth/security-user.service';
import { ProductCategoryService } from 'src/app/core/service/productCategory/product-category.service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';

@Component({
  selector: 'es-product-category-list',
  templateUrl: './product-category-list.component.html',
  styleUrls: ['./product-category-list.component.css'],
  providers: [ProductCategoryService, SecurityUserService, UtilsService]
})
export class ProductCategoryListComponent implements OnInit {

  isLoadingProductCategories: boolean = false;
  dataNotFound: boolean = false;
  productCategories: ProductCategory[] = [];

  constructor(
    private snackBarService: SnackbarService,
    private productCategoryService: ProductCategoryService) { }

  async ngOnInit() {
    await this.loadProductCategories();
  }

  async loadProductCategories() {
    this.isLoadingProductCategories = true;
    this.dataNotFound = true;

    const productCategoriesReceived = {
      next: (productCategories: ProductCategory[]) => {
        if (productCategories.length) {
          this.productCategories = productCategories;
          this.dataNotFound = false;
        }
        this.isLoadingProductCategories = false;
      },
      error: (response) => {
        this.isLoadingProductCategories = false;
        this.snackBarService.openSnackBar(response.error.message, 'close');
      }
    };

    await this.productCategoryService.getProductCategories()
      .pipe(tap(productCategoriesReceived))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  onScroll() {
    console.log('scrolled');
  }

  openEditCategory(productCategory: ProductCategory) {
    console.log('onEdit');
  }

  openRemoveCategory(productCategory: ProductCategory) {
    console.log('onRemove');
  }

  onAddNewProductCategory() {
    console.log('new ProductCategory');
  }
}
