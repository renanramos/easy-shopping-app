import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCategoryManagementRoutingModule } from './product-category-management-routing.module';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { SharedComponentsModule } from 'src/app/core/shared/components/shared-components.module';
import { ProductCategoryListComponent } from './product-category-list/product-category-list.component';

const components = [
  ProductCategoryListComponent
]

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ProductCategoryManagementRoutingModule,
    SharedComponentsModule
  ],
  exports:[...components]
})
export class ProductCategoryManagementModule { }
