import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { ProductCategory } from 'src/app/core/models/product-category/product-category.model';
import { SecurityUserService } from 'src/app/core/service/auth/security-user.service';
import { ProductCategoryService } from 'src/app/core/service/productCategory/product-category.service';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { ConstantMessages } from 'src/app/core/shared/constants/constant-messages';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { ProductCategoryDetailComponent } from '../product-category-detail/product-category-detail.component';

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

  dialogRef: MatDialogRef<ProductCategoryDetailComponent>;
  dialogRefConfirm: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    private dialog: MatDialog,
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
    this.dialogRef = this.dialog.open(ProductCategoryDetailComponent, {
      data: { productCategory: productCategory },
      autoFocus: false,
      disableClose: true,
      panelClass: 'es-small-dialog'
    });

    const afterDialogClosed = {
      next: (productCategoryReceived) => {
        if (productCategoryReceived) {
          this.loadProductCategories();
          this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_UPDATED, 'close');
        }
      }
    };

    this.dialogRef.afterClosed().subscribe(afterDialogClosed);
  }

  openRemoveCategory(productCategory: ProductCategory) {
    this.dialogRefConfirm = this.dialog.open(ConfirmDialogComponent, {
      data: { name: productCategory['name'] },
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-small-dialog'
    });

    const afterDialogClosed = {
      next: (response) => {
        console.log(response);
        if (response) {
          this.removeProductCategory(productCategory['id']);
        }
      }
    }

    this.dialogRefConfirm.afterClosed().subscribe(afterDialogClosed);
  }

  onAddNewProductCategory() {
    this.dialogRef = this.dialog.open(ProductCategoryDetailComponent, {
      data: { productCategory: new ProductCategory()},
      autoFocus: false,
      disableClose: true,
      panelClass: 'es-small-dialog'
    });

    const afterDialogClosed = {
      next: (productCategoryReceived) => {
        if (productCategoryReceived) {
          this.loadProductCategories();
          this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_CREATED, 'close');
        }
      }
    };

    this.dialogRef.afterClosed().subscribe(afterDialogClosed);
  }

  async removeProductCategory(productCategoryId: number) {

    const productCategoryRemoved = {
      next: (response) => {
        this.loadProductCategories();
        this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_REMOVED, 'close');
      },
      error: (response) => {
        this.snackBarService.openSnackBar(response.error.message, 'close');
      }
    }

    await this.productCategoryService.removeProductCategory(productCategoryId)
      .pipe(tap(productCategoryRemoved))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
