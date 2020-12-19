import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ExportToCsv } from 'export-to-csv';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { ExportCsvOptions } from 'src/app/core/models/export-csv/export-csv-model';
import { ProductCategory } from 'src/app/core/models/product-category/product-category.model';
import { SecurityUserService } from 'src/app/core/service/auth/security-user.service';
import { ProductCategoryService } from 'src/app/core/service/productCategory/product-category.service';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { ConstantMessages } from 'src/app/core/shared/constants/constant-messages';
import { ScrollValues } from 'src/app/core/shared/constants/scroll-values';
import { SearchService } from 'src/app/core/shared/service/search-service';
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

  pageNumber: number = ScrollValues.DEFAULT_PAGE_NUMBER;
  dataNotFound: boolean = false;
  productCategories: ProductCategory[] = [];
  productCategoriesToExport: ProductCategory[] = [];
  csvHeaders: string[] = ['Id', 'Nome da categoria'];

  dialogRef: MatDialogRef<ProductCategoryDetailComponent>;
  dialogRefConfirm: MatDialogRef<ConfirmDialogComponent>;

  searchSubscription: Subscription;
  filterParameter: string = '';

  constructor(
    private searchService: SearchService,
    private dialog: MatDialog,
    private snackBarService: SnackbarService,
    private productCategoryService: ProductCategoryService,
    private utilsService: UtilsService) { }

  async ngOnInit() {
    await this.loadProductCategories();
    this.subscribeToSearchService();
  }

  subscribeToSearchService() {
     this.searchService.hideSearchFieldOption(false);
    this.searchSubscription = this.searchService.searchSubject$
    .subscribe((value) => {
      this.pageNumber = ScrollValues.DEFAULT_PAGE_NUMBER;
      this.filterParameter = value;
      this.productCategories = [];
      this.loadProductCategories();
    });
  }

  async loadProductCategories() {
    this.dataNotFound = true;

    const productCategoriesReceived = {
      next: (productCategories: ProductCategory[]) => {
        if (productCategories.length) {
          this.productCategories = [...this.productCategories, ...productCategories];
          this.dataNotFound = false;
        }
      },
      error: (response) => {
        this.snackBarService.openSnackBar(response.error.message, 'close');
      }
    };

    await this.productCategoryService.getProductCategories(this.pageNumber, this.filterParameter, false)
      .pipe(tap(productCategoriesReceived))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  async onScroll() {
    this.pageNumber += 1;
    await this.loadProductCategories();
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
          this.reloadListOfItens();
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
          this.reloadListOfItens();
          this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_CREATED, 'close');
        }
      }
    };

    this.dialogRef.afterClosed().subscribe(afterDialogClosed);
  }

  async removeProductCategory(productCategoryId: number) {

    const productCategoryRemoved = {
      next: () => {
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

  reloadListOfItens() {
    this.pageNumber = ScrollValues.DEFAULT_PAGE_NUMBER;
    this.loadProductCategories();
  }

  async loadAllProductCategories() {
    const productCategoriesReceived = {
      next:(productCategories: ProductCategory[]) => {
        if (productCategories.length) {
          this.productCategoriesToExport = productCategories;
        } else {
          this.snackBarService.openSnackBar(ConstantMessages.NO_DATA_FOUND);
        }       
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
      }
    };

    await this.productCategoryService.getProductCategories(null, null, true)
      .pipe(tap(productCategoriesReceived))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
