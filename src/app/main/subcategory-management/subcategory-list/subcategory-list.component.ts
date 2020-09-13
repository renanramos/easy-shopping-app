import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { ProductCategory } from 'src/app/core/models/product-category/product-category.model';
import { Subcategory } from 'src/app/core/models/subcategory/subcategory.model';
import { ProductCategoryService } from 'src/app/core/service/productCategory/product-category.service';
import { SubcategoryService } from 'src/app/core/service/subcategory/subcategory.service';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { ConstantMessages } from 'src/app/core/shared/constants/constant-messages';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { SubcategoryDetailComponent } from '../subcategory-detail/subcategory-detail.component';

@Component({
  selector: 'es-subcategory-list',
  templateUrl: './subcategory-list.component.html',
  styleUrls: ['./subcategory-list.component.css'],
  providers: [SubcategoryService, ProductCategoryService]
})
export class SubcategoryListComponent implements OnInit {

  isLoadingSubcategories: boolean = false;
  isLoadingProductCategories: boolean = false;
  noSubcategoriesFound: boolean = false;
  subcategories: Subcategory[] = [];
  productCategories: ProductCategory[] = [];

  dialogRef: MatDialogRef<SubcategoryDetailComponent>;
  dialogRefConfirm: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private snackBarService: SnackbarService,
    private productCategoryService: ProductCategoryService,
    private subcategoryService: SubcategoryService) { }

  async ngOnInit() {
    await this.loadComponentProperties();
  }

  async loadComponentProperties() {
    await this.loadProductCategories();
    await this.loadSubcategories()
  }

  async loadSubcategories() {
    this.isLoadingSubcategories = true;
    this.noSubcategoriesFound = true;

    const receivedSubcategories = {
      next: (subcategories: Subcategory[]) => {
        if (subcategories.length) {
          this.subcategories = subcategories;
        } else {
          this.noSubcategoriesFound = true;
        }
        this.isLoadingSubcategories = false;
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
        this.isLoadingSubcategories = false;
        this.noSubcategoriesFound = true;
      }
    };

    await this.subcategoryService.getSubcategories()
      .pipe(tap(receivedSubcategories))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  async loadProductCategories() {
    this.isLoadingProductCategories = true;

    const receivedProductCategories = {
      next: (productCategories: ProductCategory[]) => {
        if (productCategories.length) {
          this.productCategories = productCategories;
        }
        this.isLoadingProductCategories = false;
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
        this.isLoadingProductCategories = false;
      }
    };

    await this.productCategoryService.getProductCategories()
      .pipe(tap(receivedProductCategories))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  onAddNewSubcategory() {
    this.dialogRef = this.dialog.open(SubcategoryDetailComponent, {
      data: { subcategory: new Subcategory() },
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-dialog'
    });

    const afterDialogClosed = {
      next: (subcategory) => {
        if (subcategory) {
          this.loadComponentProperties();
          this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_CREATED, 'close');
        }
      }
    };

    this.dialogRef.afterClosed().subscribe(afterDialogClosed);
  }

  openEditSubcategory(subcategory: Subcategory) {
    this.dialogRef = this.dialog.open(SubcategoryDetailComponent, {
      data: { subcategory: subcategory },
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-dialog'
    });

    const afterDialogClosed = {
      next: (subcategory) => {
        if (subcategory) {
          this.loadComponentProperties();
          this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_UPDATED, 'close');
        }
      }
    };

    this.dialogRef.afterClosed().subscribe(afterDialogClosed);
  }

  openRemoveSubcategory(subcategory: Subcategory) {
    this.dialogRefConfirm = this.dialog.open(ConfirmDialogComponent, {
      data: { name: subcategory['name'] },
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-small-dialog'
    });

    const afterDialogClosed = {
      next: (response) => {
        if (response) {
          this.removeSubcategory(subcategory['id']);
        }
      }
    };

    this.dialogRefConfirm.afterClosed().subscribe(afterDialogClosed);
  }

  async removeSubcategory(subcategoryId: number) {

    const removeSubcategory = {
      next: (response) => {
        this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_REMOVED, 'close');
        this.loadComponentProperties();
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
      }
    };

    await this.subcategoryService.removeSubcategory(subcategoryId)
      .pipe(tap(removeSubcategory))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  onScroll() {
    console.log('scrolled')
  }

  getCategoryNameById(categoryId: number) {
    return this.productCategories.find(productCategory => productCategory.id === categoryId)['name'];
  }
}
