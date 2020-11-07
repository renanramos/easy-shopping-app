import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Product } from '../../models/product/product.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  easyShoppingCartIndex: string = `easy-shopping-cart`;
  products: Product[] = [];
  
  newItem: Subject<any> = new Subject<any>();
  newItem$ = this.newItem.asObservable();

  shoppingCartUpdated: Subject<any> = new Subject<any>();
  shoppingCartUpdated$ = this.shoppingCartUpdated.asObservable();

  constructor() {
    this.newItem.next(this.getTotalProductsInStorage());
  }

  addItemShoppingCart(product: Product) {

    if (this.isProductAlreadyInCart(product)) {
      return;
    }
    this.products = [product, ...this.products]
    sessionStorage.setItem(this.easyShoppingCartIndex, JSON.stringify(this.products));
    this.newItem.next(this.getTotalProductsInStorage());
  }

  isProductAlreadyInCart(product: Product) {
    return this.products.find(prod => prod['id'] === product['id']);
  }

  getProductsParsed(): Product[] {
    const items = sessionStorage.getItem(this.easyShoppingCartIndex);
    return items ? JSON.parse(items) : [];
  }

  getTotalProductsInStorage() {
    return this.getProductsParsed().length;
  }

  removeItemFromShoppingCart(product: Product) {
    let items = this.getProductsParsed();
    let indexToRemove = this.getProductIndexToRemove(product, this.products);
    items.splice(indexToRemove, 1);
    this.setShoppingCartItems(items);
    this.newItem.next(this.getTotalProductsInStorage());
    this.shoppingCartUpdated.next(product);
  }

  getProductIndexToRemove(product: Product, items: any[]) {
    return items.map(item =>{ return item['id']}).indexOf(product['id']);
  }

  setShoppingCartItems(items: any[]) {
    this.products = items;
    sessionStorage.setItem(this.easyShoppingCartIndex, JSON.stringify(this.products));
  }
}