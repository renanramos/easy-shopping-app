import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/internal/operators/tap';
import { Subscription } from 'rxjs/internal/Subscription';
import { Product } from 'src/app/core/models/product/product.model';
import { Subcategory } from 'src/app/core/models/subcategory/subcategory.model';
import { SecurityUserService } from 'src/app/core/service/auth/security-user.service';
import { ProductService } from 'src/app/core/service/product/product.service';
import { ShoppingCartService } from 'src/app/core/service/shopping-cart/shopping-cart.service';
import { ScrollValues } from 'src/app/core/shared/constants/scroll-values';
import { MenuService } from 'src/app/core/shared/service/menu-service.service';
import { SearchService } from 'src/app/core/shared/service/search-service';
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
  cartSubscription: Subscription;
  searchSubscription: Subscription;

  filterName: string = '';
  pageNumber: number = ScrollValues.DEFAULT_PAGE_NUMBER;
  userLoggedRole: string = null;

  constructor(private productService: ProductService,
    private menuService: MenuService,
    private utilsService: UtilsService,
    private snackBarService: SnackbarService,
    private shoppingCartService: ShoppingCartService,
    private searchService: SearchService,
    private securityUserService: SecurityUserService,
    private router: Router) { }

  async ngOnInit() {
    await this.loadProducts();
    await this.subscribeToMenuEvent();
    this.subscribeToShoppingCart();
    this.subscribeToSearchService();
    this.userLoggedRole = this.securityUserService.userLoggedRole;
  }

  subscribeToSearchService() {
    this.searchSubscription = this.searchService.searchSubject$.subscribe(value => {
      this.filterName = value;
      this.pageNumber = ScrollValues.DEFAULT_PAGE_NUMBER;
      this.products = [];
      this.loadProducts();
    });
  }

  async subscribeToMenuEvent() {
    const menuEvent = {
      next: (subcategory) => {
        if (subcategory.id) {
          this.isListFiltererd = true;
          this.categoryFiltered = subcategory.name;
          this.loadProducts(subcategory);
        }
      }
    }

    this.menuSubscription = this.menuService.currentSubcategoryId
      .pipe(tap(menuEvent))
      .subscribe();
  }

  subscribeToShoppingCart() {
    this.cartSubscription = this.shoppingCartService.shoppingCartUpdated$.subscribe((product: Product) => {
      if (product) {
        this.updateSelectedProduct(product);
      }
    });
  }

  updateSelectedProduct(prod: Product) {
    this.products.map(product => {
      if (product['id'] === prod['id'] && product['inCart']) {
        product['inCart'] = false;
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

    await this.productService.getProducts(subcategory?.id, true, null, this.pageNumber, this.filterName)
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

  addItemToShoppingCart(product: Product) {
    if (product['inCart']) {
      this.shoppingCartService.removeItemFromShoppingCart(product);
      product['inCart'] = false;
    } else {
      this.shoppingCartService.addItemShoppingCart(product);
      product['inCart'] = true;
    }
  }

  prepareItemToBuy(prod: Product) {
    this.shoppingCartService.addItemShoppingCart(prod);
    this.redirectToUserManagement();
  }

  redirectToUserManagement() {
    this.router.navigateByUrl('/main/user-management', {
      state: { openDialog: true }
    });
  }
}
