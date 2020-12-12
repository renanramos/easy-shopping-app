import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { ProductCategory } from 'src/app/core/models/product-category/product-category.model';
import { Subcategory } from 'src/app/core/models/subcategory/subcategory.model';
import { ProductCategoryService } from 'src/app/core/service/productCategory/product-category.service';
import { SubcategoryService } from 'src/app/core/service/subcategory/subcategory.service';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { ConstantMessages } from 'src/app/core/shared/constants/constant-messages';
import { ScrollValues } from 'src/app/core/shared/constants/scroll-values';
import { SearchService } from 'src/app/core/shared/service/search-service';
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

  noSubcategoriesFound: boolean = false;
  subcategories: Subcategory[] = [];
  productCategories: ProductCategory[] = [];
  subcategoriesToExport: Subcategory[] = [];
  csvHeaders: string[] = [];

  dialogRef: MatDialogRef<SubcategoryDetailComponent>;
  dialogRefConfirm: MatDialogRef<ConfirmDialogComponent>;

  searchSubsctiption: Subscription;
  filterName: string = '';
  pageNumber: number = ScrollValues.DEFAULT_PAGE_NUMBER;

  constructor(
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private snackBarService: SnackbarService,
    private subcategoryService: SubcategoryService,
    private searchService: SearchService) { }

  async ngOnInit() {
    await this.loadComponentProperties();
    this.subscribeToSearchService();
  }

  subscribeToSearchService() {
    this.searchService.hideSearchFieldOption(false);
    this.searchSubsctiption = this.searchService.searchSubject$
    .subscribe((value) => {
      this.pageNumber = ScrollValues.DEFAULT_PAGE_NUMBER;
      this.filterName = value;
      this.subcategories = [];
      this.loadSubcategories();
    });
  }

  async loadComponentProperties() {
    this.subcategories = [];
    await this.loadSubcategories()
  }

  async loadSubcategories() {
    this.noSubcategoriesFound = true;

    const receivedSubcategories = {
      next: (subcategories: Subcategory[]) => {
        if (subcategories.length) {
          this.subcategories = subcategories;
        } else {
          this.noSubcategoriesFound = true;
        }
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
        this.noSubcategoriesFound = true;
      }
    };

    await this.subcategoryService.getSubcategories(this.pageNumber, null, this.filterName, false)
      .pipe(tap(receivedSubcategories))
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
    this.pageNumber += 1;
    this.loadComponentProperties();
  }

  async loadAllSubcategories() {
    this.csvHeaders = ['Id', 'Nome da subcategoria','Id da categoria', 'Nome da categoria'];
    const subcategoriesReceived = {
      next: (subcategories: Subcategory[]) => {
        if (subcategories.length) {
          this.subcategoriesToExport = subcategories;
          console.log(this.subcategories);
        }
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
      }
    };

    await this.subcategoryService.getSubcategories(null, null, null, true)
      .pipe(tap(subcategoriesReceived))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
