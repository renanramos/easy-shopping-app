import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { ProductCategory } from 'src/app/core/models/product-category/product-category.model';
import { ProductCategoryService } from 'src/app/core/service/productCategory/product-category.service';
import { SubcategoryService } from 'src/app/core/service/subcategory/subcategory.service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';

@Component({
  selector: 'app-product-category-detail',
  templateUrl: './product-category-detail.component.html',
  styleUrls: ['./product-category-detail.component.css'],
  providers: [ProductCategoryService]
})
export class ProductCategoryDetailComponent implements OnInit {

  productCategoryForm: FormGroup;
  productCategory: ProductCategory;
  isWaitingResponse: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private snackBarService: SnackbarService,
              private productCategoryService: ProductCategoryService,
              private dialogRef: MatDialogRef<ProductCategoryDetailComponent>,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.productCategory = this.data['productCategory'] ? this.data['productCategory'] : new ProductCategory();
    this.createForm();
  }

  createForm() {
    this.productCategoryForm = this.formBuilder.group({
      name: [this.productCategory.name, [Validators.required]]
    });
  }

  get name() {
    return this.productCategoryForm.get('name');
  }

  async submitProductCategory() {
    this.productCategoryForm.invalid ?
      this.productCategoryForm.markAllAsTouched() :
      await this.saveProductCategory();
  }

  async saveProductCategory() {
    this.isWaitingResponse = true;
    this.productCategory['id'] ?
      this.updateProductCategory() :
      await this.addProductCategory();
  }

  async updateProductCategory() {
    const productCategory: ProductCategory = this.productCategoryForm.getRawValue();
    productCategory['id'] = this.productCategory['id'];

    const productCategoryReceived = {
      next: (productCategory: ProductCategory) => {
        if (productCategory) {
          this.dialogRef.close(productCategory);
        }
        this.isWaitingResponse = false;
      },
      error: (response) => {
        this.isWaitingResponse = false;
        this.snackBarService.openSnackBar(response.error.message, 'close');
        this.isWaitingResponse = false;
      }
    };

    await this.productCategoryService.updateProductCategory(productCategory)
      .pipe(tap(productCategoryReceived))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  async addProductCategory() {

    const productCategory: ProductCategory = this.productCategoryForm.getRawValue();

    const productCategoryReceived = {
      next: (productCategory: ProductCategory) => {
        if (productCategory) {
          this.dialogRef.close(productCategory);
        }
        this.isWaitingResponse = false;
      },
      error: (response) => {
        this.isWaitingResponse = false;
        this.snackBarService.openSnackBar(response.error.message, 'close');
        this.isWaitingResponse = false;
      }
    };

    await this.productCategoryService.saveNewProductCategory(productCategory)
      .pipe(tap(productCategoryReceived))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
