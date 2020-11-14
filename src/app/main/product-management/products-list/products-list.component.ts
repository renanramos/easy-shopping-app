import { Component, OnInit, OnDestroy } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { ProductService } from '../../../core/service/product/product.service';
import { Product } from 'src/app/core/models/product/product.model';
import { MenuService } from 'src/app/core/shared/service/menu-service.service';
import { Subcategory } from 'src/app/core/models/subcategory/subcategory.model';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { ConstantMessages } from 'src/app/core/shared/constants/constant-messages';
import { ConfirmDialogComponent } from 'src/app/core/shared/components/confirm-dialog/confirm-dialog.component';
import { ProductUploadImageComponent } from '../product-upload-image/product-upload-image.component';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';
import { SecurityUserService } from 'src/app/core/service/auth/security-user.service';
import { PublishProductComponentComponent } from './publish-product-component/publish-product-component.component';

@Component({
  selector: 'es-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
  providers: [ProductService]
})
export class ProductsListComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  isListFiltererd: boolean = false;
  categoryFiltered: String = "";
  noProductsFound: boolean = false;
  subscription: Subscription;

  dialogRef: MatDialogRef<ProductDetailComponent>;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  uploadImageDialogRef: MatDialogRef<ProductUploadImageComponent>;
  publishProductDialogRef: MatDialogRef<PublishProductComponentComponent>;
  userId: string = '';
  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    private menuService: MenuService,
    private snackBarService: SnackbarService,
    private utilsService: UtilsService,
    private securityUserService: SecurityUserService) { }

  async ngOnInit() {
    this.userId = this.securityUserService.userLoggedId;
    await this.loadProducts();
    this.subscription = this.menuService.currentSubcategoryId.subscribe(subcategory => {
      if (subcategory.id) {
        this.isListFiltererd = true;
        this.categoryFiltered = subcategory.name;
        this.loadProducts(subcategory);
      }
    });
  }

  ngOnDestroy() {
    this.subscription &&
      this.subscription.unsubscribe();
  }

  async loadProducts(subcategory?: Subcategory) {
    this.products = [];
    this.noProductsFound = false;
    const receivedProducts = {
      next: (products: []) => {
        if (products.length) {
          this.products = products;
        } else {
          this.noProductsFound = true;
        }
      },
      error: (error) => {
        this.noProductsFound = false;
      }
    }

    await this.productService.getProducts(subcategory?.id, null, null)
    .pipe(tap(receivedProducts))
    .toPromise()
    .then()
    .catch();
  }

  async removeFilter() {
    this.isListFiltererd = false;
    this.categoryFiltered = "";
    await this.loadProducts();
  }

  onAddNewProduct() {
    this.dialogRef = this.dialog.open(ProductDetailComponent, {
      data: new Product(),
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-dialog'
    });

    const afterDialogClose = {
      next: (response) => {
        if (response) {
          this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_CREATED, 'close');
          this.loadProducts();
        }
      }
    }

    this.dialogRef.afterClosed().subscribe(afterDialogClose);
  }

  openEditProduct(product: Product) {
    this.dialogRef = this.dialog.open(ProductDetailComponent, {
      data: { product: product },
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-dialog'
    });

    this.dialogRef.afterClosed().subscribe((response) => {
      response && this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_UPDATED);
      this.loadProducts();
    });
  }

  openRemoveProduct(product: Product) {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { name: product['name'] },
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-small-dialog'
    });

    this.confirmDialogRef.afterClosed().subscribe((response) => response && this.removeProduct(product));
  }

  async removeProduct(product: Product) {

    const receivedRemoveResponse = {
      next: (response) => {
        this.loadProducts();
        this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_REMOVED, 'close');
      }
    };

    await this.productService.removeProduct(product.id)
      .pipe(tap(receivedRemoveResponse))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  openUploadProductImage(product: Product) {
    this.uploadImageDialogRef = this.dialog.open(ProductUploadImageComponent, {
      data: { product: product },
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-dialog'
    });

    const receivedUploadedImage = {
      next: (isUploaded: boolean) => {
        if (isUploaded) {
          this.snackBarService.openSnackBar(ConstantMessages.SUCCESSFULLY_CREATED);
        }
        this.loadProducts();
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage, 'close');
      }
    }

    this.uploadImageDialogRef.afterClosed().subscribe(receivedUploadedImage);
  }

  openPublishProduct(product: Product) {
    this.publishProductDialogRef = this.dialog.open(PublishProductComponentComponent, {
      data: { product: product },
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-small-dialog'
    });

    const productPublished = {
      next: (product: Product) => {
        if (product) {
          this.loadProducts();
          this.snackBarService.openSnackBar(ConstantMessages.PRODUCT_PUBLISHED_SUCCESSFULLY);
        }
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
      }
    }

    this.publishProductDialogRef.afterClosed().subscribe(productPublished);
  }
}
