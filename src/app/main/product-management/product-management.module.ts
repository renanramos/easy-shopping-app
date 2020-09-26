import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { NgSlimScrollModule } from 'ngx-slimscroll';

import { ProductsListComponent } from './products-list/products-list.component';
import { ProductManagementRoutingModule } from './product-management-routing.module';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { SharedComponentsModule } from 'src/app/core/shared/components/shared-components.module';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { DirectivesModule } from 'src/app/core/shared/directives/directives.modules';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

const components = [
  ProductsListComponent,
  ProductDetailComponent
]

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    ProductManagementRoutingModule,
    SharedComponentsModule,
    DirectivesModule,
    NgSlimScrollModule,
    InfiniteScrollModule,
    NgxMaskModule.forRoot()
  ],
  exports:[...components]
})
export class ProductManagementModule { }