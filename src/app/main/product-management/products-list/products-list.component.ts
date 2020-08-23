import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/service/product/product.service';
import { Product } from 'src/app/core/models/product/product.model';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'es-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
  providers: [ProductService]
})
export class ProductsListComponent implements OnInit {

  products: Product[] = [];

  constructor(private productService: ProductService) { }

  async ngOnInit() {
    await this.loadProducts();
  }

  async loadProducts() {
    const receivedProducts = {
      next: (products: Product[]) => {
        if (products.length) {
          this.products = products;
        }
      },
      error: (error) => {
        console.error(error);
      }
    }

    await this.productService.getProducts()
    .pipe(tap(receivedProducts))
    .toPromise()
    .then()
    .catch();
  }

}
