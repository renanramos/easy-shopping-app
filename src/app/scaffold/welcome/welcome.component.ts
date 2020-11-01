import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/internal/operators/tap';
import { Subscription } from 'rxjs/internal/Subscription';
import { Product } from 'src/app/core/models/product/product.model';
import { Subcategory } from 'src/app/core/models/subcategory/subcategory.model';
import { ProductService } from 'src/app/core/service/product/product.service';
import { MenuService } from 'src/app/core/shared/service/menu-service.service';
import { SnackbarService } from 'src/app/core/shared/service/snackbar.service';
import { UtilsService } from 'src/app/core/shared/utils/utils.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  providers: [ProductService]
})
export class WelcomeComponent implements OnInit {

  products: Product[] = [];
  isListFiltererd: boolean = false;
  categoryFiltered: String = "";
  productsNotFound: boolean = false;
  menuSubscription: Subscription;

  constructor(private productService: ProductService,
    private menuService: MenuService,
    private utilsService: UtilsService,
    private snackBarService: SnackbarService) { }

  async ngOnInit() {
    await this.loadProducts();

    this.menuSubscription = this.menuService.currentSubcategoryId.subscribe(subcategory => {
      if (subcategory.id) {
        this.isListFiltererd = true;
        this.categoryFiltered = subcategory.name;
        this.loadProducts(subcategory);
      }
    });
  }

  async loadProducts(subcategory?: Subcategory) {
    this.products = [];
    const productsReceived = {
      next: (products: Product[]) => {
        if (products.length) {
          this.products = products;
          this.productsNotFound = false;
        } else {
          this.productsNotFound = true;
        }
      },
      error: (response) => {
        this.productsNotFound = true;
        const message = this.utilsService.handleErrorMessage(response);
        this.snackBarService.openSnackBar(message, 'close');
      }
    };

    await this.productService.getProducts(subcategory?.id)
      .pipe(tap(productsReceived))
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }

  async removeFilter() {
    this.isListFiltererd = false;
    this.categoryFiltered = "";
    await this.loadProducts();
  }

}
