import { Component, OnInit, OnDestroy } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { ProductService } from '../../../core/service/product/product.service';
import { Product } from 'src/app/core/models/product/product.model';
import { MenuService } from 'src/app/core/shared/service/menu-service.service';
import { Subcategory } from 'src/app/core/models/subcategory/subcategory.model';
import { ProductDeteailComponent } from '../product-deteail/product-deteail.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

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

  dialogRef: MatDialogRef<ProductDeteailComponent>;

  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    private menuService: MenuService) { }

  async ngOnInit() {
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

    await this.productService.getProducts(subcategory?.id)
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
    this.dialogRef = this.dialog.open(ProductDeteailComponent, {
      data: new Product(),
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-dialog'
    });

    const afterDialogClose = {
      next: (response) => {
        this.loadProducts();
      }
    }

    this.dialogRef.afterClosed().subscribe(afterDialogClose);
  }
}
