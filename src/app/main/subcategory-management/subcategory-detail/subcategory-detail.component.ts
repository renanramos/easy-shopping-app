import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { ProductCategory } from 'src/app/core/models/product-category/product-category.model';
import { Subcategory } from 'src/app/core/models/subcategory/subcategory.model';
import { ProductCategoryService } from 'src/app/core/service/productCategory/product-category.service';
import { SubcategoryService } from 'src/app/core/service/subcategory/subcategory.service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';

@Component({
  selector: 'es-subcategory-detail',
  templateUrl: './subcategory-detail.component.html',
  styleUrls: ['./subcategory-detail.component.css'],
  providers: [SubcategoryService, ProductCategoryService]
})
export class SubcategoryDetailComponent implements OnInit {

  subcategoryForm: FormGroup;

  subcategory: Subcategory;
  productCategories: ProductCategory[] = [];

  isLoadingProductCategories: boolean = false;
  isWaitingResponse: boolean = false;

  productCategoriesNotFound: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private dialogRef: MatDialogRef<SubcategoryDetailComponent>,
    private snackBarService: SnackbarService,
    private subcategoryService: SubcategoryService,
    private productCategoryService: ProductCategoryService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  async ngOnInit() {
    this.subcategory = this.data['subcategory'] ? this.data['subcategory'] : new Subcategory();
    this.createForm();
    await this.loadProductCategories();
  }

  createForm() {
    this.subcategoryForm = this.formBuilder.group({
      name: [this.subcategory.name, [Validators.required]],
      productCategoryId: [this.subcategory.productCategoryId, [Validators.required]]
    });
  }

  async loadProductCategories() {
    this.isLoadingProductCategories = true;
    
    const receivedProductCategories = {
      next: (productCategories: ProductCategory[]) => {
        if (productCategories.length) {
          this.productCategories = productCategories;
        } else {
          this.productCategoriesNotFound = true;
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

  async onSubmitSubcategory() {
    this.subcategoryForm.invalid ?
      this.subcategoryForm.markAllAsTouched() :
      await this.saveSubcategory();
  }

  async saveSubcategory() {
    this.subcategory['id'] ?
      await this.updateSubcategory() :
      await this.saveNewSubcategory() ;
  }

  async saveNewSubcategory() {
    this.isWaitingResponse = true;
    const subcategory: Subcategory = this.subcategoryForm.getRawValue();

    const receivedSubcategory = {
      next: (subcategory: Subcategory) => {
        if (subcategory) {
          this.dialogRef.close(subcategory);
        }
        this.isWaitingResponse = false;
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
        this.isWaitingResponse = false;
      }
    };

    await this.subcategoryService.saveNewSubcategory(subcategory)
      .pipe(tap(receivedSubcategory))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  async updateSubcategory() {
    this.isWaitingResponse = true;
    const subcategory: Subcategory = this.subcategoryForm.getRawValue();
    subcategory['id'] = this.subcategory['id'];
    const receivedSubcategory = {
      next: (subcategory: Subcategory) => {
        if (subcategory) {
          this.dialogRef.close(subcategory);
        }
        this.isWaitingResponse = false;
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
        this.isWaitingResponse = false;
      }
    };

    await this.subcategoryService.updateSubcategory(subcategory)
      .pipe(tap(receivedSubcategory))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  get name() {
    return this.subcategoryForm.get('name');
  }

  get productCategoryId() {
    return this.subcategoryForm.get('productCategoryId');
  }
}