import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductManagementRoutingModule } from './product-management-routing.module';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { SharedComponentsModule } from 'src/app/core/shared/components/shared-components.module';

const components = [
  ProductsListComponent
]

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ProductManagementRoutingModule,
    SharedComponentsModule
  ],
  exports:[...components]
})
export class ProductManagementModule { }