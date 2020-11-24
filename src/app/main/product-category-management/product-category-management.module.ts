import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ReactiveFormsModule } from '@angular/forms';

import { ProductCategoryManagementRoutingModule } from './product-category-management-routing.module';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { SharedComponentsModule } from 'src/app/core/shared/components/shared-components.module';
import { ProductCategoryListComponent } from './product-category-list/product-category-list.component';
import { ProductCategoryDetailComponent } from './product-category-detail/product-category-detail.component';
import { DirectivesModule } from 'src/app/core/shared/directives/directives.modules';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

const components = [
  ProductCategoryListComponent,
  ProductCategoryDetailComponent
]

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    ProductCategoryManagementRoutingModule,
    DirectivesModule,
    SharedComponentsModule,
    NgSlimScrollModule,
    InfiniteScrollModule,
    NgxMaskModule.forRoot()
  ],
  exports:[...components]
})
export class ProductCategoryManagementModule { }
