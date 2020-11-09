import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';

import { Product } from 'src/app/core/models/product/product.model';
import { Store } from 'src/app/core/models/store/store.model';
import { Subcategory } from 'src/app/core/models/subcategory/subcategory.model';
import { SecurityUserService } from 'src/app/core/service/auth/security-user.service';
import { ProductService } from 'src/app/core/service/product/product.service';
import { StoreService } from 'src/app/core/service/store/store.service';
import { SubcategoryService } from 'src/app/core/service/subcategory/subcategory.service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';

@Component({
  selector: 'es-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  providers: [StoreService, ProductService, SubcategoryService]
})
export class ProductDetailComponent implements OnInit {

  productForm: FormGroup;
  product: Product = new Product();

  subcategories: Subcategory[] = [];
  stores: Store[] = [];

  isAdminUser: boolean = false;
  productPrice: string = '';

  constructor(private formBuilder: FormBuilder,
        private storeService: StoreService,
        private subcategoryService: SubcategoryService,
        private securityUserService: SecurityUserService,
        private productService: ProductService,
        private snackBarService: SnackbarService,
        private utilsService: UtilsService,
        private dialogRef: MatDialogRef<ProductDetailComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

  async ngOnInit() {
    await this.initializeComponentsProperties();
    await this.createForm();
    await this.loadSubcategories();
    await this.loadStores();
  }

  async initializeComponentsProperties() {
    this.product = this.data['product'] ? this.data['product'] : new Product();
    this.formatPriceValue();
    this.isAdminUser = this.securityUserService.isAdminUser;
  }

  async createForm() {
    this.productForm = await this.formBuilder.group({
      name: [this.product.name, [Validators.required]],
      description: [this.product.description, [Validators.required]],
      price: [this.productPrice, [Validators.required]],
      productSubcategoryId: [this.product['subcategoryId'], [Validators.required]],
      storeId: [this.product.storeId, [Validators.required]]
    })
  }

  formatPriceValue() {
    if (this.product['price']) {
      this.productPrice = this.product['price'].toString();
      this.productPrice = this.productPrice.replace('.', ',');
    }
  }

  async loadSubcategories() {
    const receivedSubcategories = {
      next: (subcategories: Subcategory[]) => {
        if(subcategories.length) {
          this.subcategories = subcategories;
        } else {
          this.productSubcategoryId.setErrors({
            'notFound' : true
          });
          this.productSubcategoryId.markAsTouched();
        }
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
      }
    };

    await this.subcategoryService.getSubcategories(null, null, true)
      .pipe(tap(receivedSubcategories))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
  
  async loadStores() {
    const receivedStores = {
      next: (stores: Store[]) => {
        if (stores.length) {
          this.stores = stores;
        } else {
          this.storeId.setErrors({
            'notFound': true
          });
          this.storeId.markAsTouched();
        }
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
      }
    };

    await this.storeService.getStores(null, null, null, true)
      .pipe(tap(receivedStores))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  async submitProduct() {
    this.productForm.invalid ?
      this.productForm.markAllAsTouched() :
      await this.saveProduct();
  }

  async saveProduct() {
    this.product['id'] ?
      await this.updateProduct() :
      await this.createProduct();
  }

  async createProduct() {
    let product = this.productForm.getRawValue();
    product['price'] = Number(product['price']);
    const receiveNewProduct = {
      next: (newProduct: Product) => {
        this.dialogRef.close(newProduct);
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
      }
    };

    await this.productService.saveProduct(product)
      .pipe(tap(receiveNewProduct))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  async updateProduct() {
    let product = this.productForm.getRawValue();
    product['price'] = Number(product['price']);
    product['id'] = this.product.id;

    const receivedUpdatedProduct = {
      next: (productUpdated: Product) => {
        this.dialogRef.close(productUpdated);
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
      }
    };

    await this.productService.updateProduct(product)
      .pipe(tap(receivedUpdatedProduct))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  get name() {
    return this.productForm.get('name');
  }

  get description() {
    return this.productForm.get('description');
  }

  get price() {
    return this.productForm.get('price');
  }

  get productSubcategoryId() {
    return this.productForm.get('productSubcategoryId');
  }

  get storeId() {
    return this.productForm.get('storeId');
  }
}
