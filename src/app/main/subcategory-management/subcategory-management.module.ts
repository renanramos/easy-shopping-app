import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SubcategoryManagementRoutingModule } from './subcategory-management-routing.module';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { SharedComponentsModule } from 'src/app/core/shared/components/shared-components.module';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { SubcategoryListComponent } from './subcategory-list/subcategory-list.component';
import { SubcategoryDetailComponent } from './subcategory-detail/subcategory-detail.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

const components = [
  SubcategoryListComponent,
  SubcategoryDetailComponent
]

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    SubcategoryManagementRoutingModule,
    SharedComponentsModule,
    NgSlimScrollModule,
    InfiniteScrollModule,
    NgxMaskModule.forRoot()
  ],
  exports: [...components]
})
export class SubcategoryManagementModule { }
