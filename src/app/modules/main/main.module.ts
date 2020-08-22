import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsListComponent } from './products-list/products-list.component';
import { MainRoutingModule } from './main-routing.modules';

const components = [
  ProductsListComponent
]

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    CommonModule,
    MainRoutingModule
  ]
})
export class MainModule { }
