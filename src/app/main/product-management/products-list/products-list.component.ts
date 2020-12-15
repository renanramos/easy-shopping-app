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
import { ScrollValues } from 'src/app/core/shared/constants/scroll-values';
import { SearchService } from 'src/app/core/shared/service/search-service';

@Component({
  selector: 'es-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
  providers: [ProductService]
})
export class ProductsListComponent implements OnInit, OnDestroy {

  products: Product[] = [];
  productsToExport: Product[] = [];
  csvHeaders: string[] = [];
  isListFiltererd: boolean = false;
  categoryFiltered: String = "";
  noProductsFound: boolean = false;
  menuSubscription: Subscription;
  searchServiceSubscription: Subscription;
  pageNumber: number = ScrollValues.DEFAULT_PAGE_NUMBER;
  filterName: string = '';
  isLoadingMore: boolean = false;

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
    private securityUserService: SecurityUserService,
    private searchService: SearchService) { }

  async ngOnInit() {
    this.userId = this.securityUserService.userLoggedId;
    await this.loadProducts();
    await this.subscribeToMenuService();
    await this.subscribeToSearchService();
  }

  async subscribeToSearchService() {
    this.searchService.hideSearchFieldOption(false);
    this.searchServiceSubscription = await this.searchService.searchSubject$.subscribe(value => {
      this.pageNumber = ScrollValues.DEFAULT_PAGE_NUMBER;
      this.filterName = value;
      this.products = [];
      this.loadProducts();
    })
  }

  async subscribeToMenuService() {
    this.menuSubscription = await this.menuService.currentSubcategoryId.subscribe(subcategory => {
      if (subcategory.id) {
        this.isListFiltererd = true;
        this.categoryFiltered = subcategory.name;
        this.loadProducts(subcategory);
      }
    });
  }

  ngOnDestroy() {
    this.menuSubscription &&
      this.menuSubscription.unsubscribe();
  }

  async loadProducts(subcategory?: Subcategory) {
    this.noProductsFound = false;
    this.isLoadingMore = true;

    const receivedProducts = {
      next: (products: []) => {
        if (products.length) {
          this.products = products;
        }
        this.isLoadingMore = false;
      },
      error: (error) => {
        this.noProductsFound = true;
        this.isLoadingMore = false;
      }
    }

    await this.productService.getProducts(subcategory?.id, null, null, this.pageNumber, this.filterName)
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
          this.loadProducts();
        }
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

  onScroll() {
    this.pageNumber += 1;
    this.loadProducts();
  }

  async loadAllProducts() {
    const productsReceived = {
      next: (products: Product[]) => {
        if (products.length) {
          this.prepareProductsToExport(products);
        }
      },
      error: (response) => {
        const errorMessage = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(errorMessage);
      }
    };
  
    await this.productService.getProducts(null, null, null, null, null)
      .pipe(tap(productsReceived))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  prepareProductsToExport(products: Product[]) {
    let prodToExport: Product[] = [];
    this.csvHeaders = ['Id do produto', 'Nome do produto', 'Descrição', 'Preço', 'Categoria'];
    products.forEach((product: Product) => {
      const prod: Product = {
        id: product['id'],
        name: product['name'],
        description: product['description'],
        price: product['price'],
        productCategoryName: product['subcategoryName']
      };
      prodToExport.push(prod);
    });
    this.productsToExport = [...prodToExport];
  }
}
