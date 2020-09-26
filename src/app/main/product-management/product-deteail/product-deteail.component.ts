import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { ProductCategory } from 'src/app/core/models/product-category/product-category.model';
import { Product } from 'src/app/core/models/product/product.model';
import { Company } from 'src/app/core/models/registration/company.model';
import { Store } from 'src/app/core/models/store/store.model';
import { Subcategory } from 'src/app/core/models/subcategory/subcategory.model';
import { SecurityUserService } from 'src/app/core/service/auth/security-user.service';
import { CompanyService } from 'src/app/core/service/company/company.service';
import { ProductService } from 'src/app/core/service/product/product.service';
import { ProductCategoryService } from 'src/app/core/service/productCategory/product-category.service';
import { StoreService } from 'src/app/core/service/store/store.service';
import { SubcategoryService } from 'src/app/core/service/subcategory/subcategory.service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';

@Component({
  selector: 'es-product-deteail',
  templateUrl: './product-deteail.component.html',
  styleUrls: ['./product-deteail.component.css'],
  providers: [StoreService, ProductService, SubcategoryService, CompanyService]
})
export class ProductDeteailComponent implements OnInit {

  productForm: FormGroup;
  product: Product = new Product();

  subcategories: Subcategory[] = [];
  companies: Company[] = [];
  stores: Store[] = [];

  userCompanyId: number = null;

  constructor(private formBuilder: FormBuilder,
        private storeService: StoreService,
        private subcategoryService: SubcategoryService,
        private securityUserService: SecurityUserService,
        private productService: ProductService,
        private companyService: CompanyService,
        private snackBarService: SnackbarService,
        private utilsService: UtilsService,
        private dialogRef: MatDialogRef<ProductDeteailComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

  async ngOnInit() {
    this.initializeComponentsProperties();
    this.createForm();
    await this.loadSubcategories();
    await this.loadCompanies();
    await this.loadStores();
  }

  initializeComponentsProperties() {
    this.product = this.data['product'] ? this.data['product'] : new Product();
  }

  createForm() {
    this.productForm = this.formBuilder.group({
      name: [this.product.name, [Validators.required]],
      description: [this.product.description, [Validators.required]],
      price: [this.product.price, [Validators.required]],
      productSubcategoryId: [this.product.productCategoryId, [Validators.required]],
      companyId: [this.product.companyId, [Validators.required]],
      storeId: [this.product.storeId, [Validators.required]]
    })
  }

  async loadSubcategories() {
    const receivedSubcategories = {
      next: (subcategories: Subcategory[]) => {
        this.subcategories = subcategories;
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

  async loadCompanies() {
   const receivedCompanies = {
     next: (companies: Company[]) => {
       this.companies = companies;
     },
     error: (response) => {
       const errorMessage = this.utilsService.handleErrorMessage(response);
       this.snackBarService.openSnackBar(errorMessage, 'close');
     }
   };
  
   await this.companyService.getCompanies(null, null, null, true)
    .pipe(tap(receivedCompanies))
    .toPromise()
    .then(() => true)
    .catch(() => false);
  }
  
  async loadStores() {
    const receivedStores = {
      next: (stores: Store[]) => {
        this.stores = stores;
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
      this.updateProduct() :
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

  updateProduct() {
    
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

  get companyId() {
    return this.productForm.get('companyId');
  }

  get storeId() {
    return this.productForm.get('storeId');
  }
}
