import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../core/service/product/product.service';
import { Product } from 'src/app/core/models/product/product.model';

@Component({
  selector: 'es-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {

  products: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.loadProducts();
  }

  private loadProducts() {
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
    this.productService.getProducts().subscribe(receivedProducts);
  }

}
