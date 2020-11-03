import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Product } from '../../models/product/product.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  easyShoppingCartIndex: string = `easy-shopping-cart`;
  products: any = [];

  constructor() { }

  addItemShoppingCart(product: Product) {
    let items = this.getProductsParsed();
    this.products = [product, ...items]
    sessionStorage.setItem(this.easyShoppingCartIndex, JSON.stringify(this.products));
  }

  getProductsParsed(): any[] {
    const items = sessionStorage.getItem(this.easyShoppingCartIndex);
    return items ? JSON.parse(items) : [];
  }

  getTotalProductsInStorage() {
    return this.getProductsParsed().length;
  }  
}