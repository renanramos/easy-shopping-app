import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../../core/service/product/product.service';
import { Product } from 'src/app/core/models/product/product.model';
import { tap } from 'rxjs/operators';
import { MenuService } from 'src/app/core/shared/service/menu-service.service';
import { Subject, Observable, Subscription } from 'rxjs';
import { Subcategory } from 'src/app/core/models/subcategory/subcategory.model';

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

  constructor(private productService: ProductService,
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
    this.subscription.unsubscribe();
  }

  async loadProducts(subcategory?: Subcategory) {
    this.products = [];
    this.noProductsFound = false;
    const receivedProducts = {
      next: (products: Product[]) => {
        if (products.length) {
          this.products = products;
        } else {
          this.noProductsFound = true;
        }
      },
      error: (error) => {
        console.error(error);
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
}
