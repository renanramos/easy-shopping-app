import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/service/product/product.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {

  constructor(private productService: ProductService) { }

  async ngOnInit() {
    await this.loadProducts();
  }

  private async loadProducts() {
    const receivedProducts = {
      next: (products) => {
        console.log(products);
      },
      error: (error) => {
        console.error(error);
      }
    }
    await this.productService.getProducts()
      .toPromise()
      .then()
      .catch();
  }

}
