import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ProductCategoryService } from '../core/service/productCategory/product-category.service';
import { ProductCategory } from '../core/models/product-category/product-category.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';
import { SubcategoryService } from '../core/service/subcategory/subcategory.service';
import { Subcategory } from '../core/models/subcategory/subcategory.model';
import { MenuService } from '../core/shared/service/menu-service.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginFormComponent } from '../login/components/login-form/login-form.component';
import { CookieService } from 'ngx-cookie-service';
import { UserCredentials } from '../core/models/user/user-credentials.model';
import { Router } from '@angular/router';

@Component({
  selector: 'es-scaffold',
  templateUrl: './scaffold.component.html',
  styleUrls: ['./scaffold.component.css'],
  providers: [ProductCategoryService, SubcategoryService]
})
export class ScaffoldComponent implements OnInit {

  userLoggedName: string = '';
  productsCategories: ProductCategory[] = [];
  subcategories: Subcategory[] = [];
  changeArrowIcon = true;

  @ViewChild('drawer', { static: true}) drawer: MatDrawer;

  constructor(private productCategoryService: ProductCategoryService,
    private subcategoryService: SubcategoryService,
    private menuService: MenuService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private cookieService: CookieService,
    public router: Router) {
  }

  async ngOnInit() {
    this.drawer.open();
    this.userLoggedName = this.cookieService.get('username');
    await this.loadProductsCategories();
  }

  async loadProductsCategories() {
    const receivedProductsCategories = {
      next: (productsCategories: ProductCategory[]) => {
        if (productsCategories.length) {
          this.productsCategories = productsCategories;
          this.disableProductCategoryToShow();
        } else {
          this.snackBar.open('Não há categorias de produtos cadastradas.');
        }
      },
      error: () => this.snackBar.open('Não foi possível carregar as categorias dos produtos.')
    };

    await this.productCategoryService.getProductCategories()
      .pipe(tap(receivedProductsCategories))
      .toPromise()
      .then()
      .catch();
  }

  disableProductCategoryToShow(productCategory?: ProductCategory) {
    this.productsCategories.map(proCateg => {
      if (productCategory != proCateg) {
        proCateg.enabled = false;
        this.changeArrowIcon = true;
      }
    });
  }

  async getSubcategory(productCategory: ProductCategory) {
    this.changeArrowIcon = !this.changeArrowIcon;
    await this.loadSubcategory(productCategory);
  }

  async loadSubcategory(productCategory: ProductCategory) {

    this.disableProductCategoryToShow(productCategory);
    productCategory.enabled = !productCategory.enabled;

    const receiveSubcategories = {
      next: (subcategories: Subcategory[]) => {
        this.subcategories = subcategories;
      },
      error: () => this.snackBar.open('Não foi possível buscar subcategorias.')
    };

    await this.subcategoryService.getSubcategories(productCategory.id)
    .pipe(tap(receiveSubcategories))
    .toPromise()
    .then()
    .catch();
  }

  subcategorySelected(sub: Subcategory) {
    this.menuService.setSubategory(sub);
  }

  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginFormComponent, {
      disableClose: true,
      autoFocus: false,
      panelClass: 'es-dialog'
    });

    dialogRef.afterClosed().subscribe((userCredentials: UserCredentials) => {
      if (userCredentials) {
        this.cookieService.set('role', userCredentials.roles[0]);
        this.cookieService.set('username', userCredentials.username);
        this.cookieService.set('token', userCredentials.token);
        this.userLoggedName = this.cookieService.get('username');
      }
    })
  }

  logout() {
    this.cookieService.deleteAll();
    this.userLoggedName = "";
  }

  onRedirectSignUp() {
    this.router.navigate(['/registration']);
  }
}
