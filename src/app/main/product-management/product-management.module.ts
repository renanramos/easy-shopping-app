import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductManagementRoutingModule } from './product-management-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

const components = [
  ProductsListComponent
]

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    CommonModule,
    ProductManagementRoutingModule,
    MatCardModule,
    MatButtonModule
  ],
  exports:[...components]
})
export class ProductManagementModule { }