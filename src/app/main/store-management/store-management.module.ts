import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { SharedComponentsModule } from 'src/app/core/shared/components/shared-components.module';
import { StoreListComponent } from './store-list/store-list.component';
import { StoreDetailComponent } from './store-detail/store-detail.component';
import { StoreManagementRoutingModule } from './store-management-routing.module';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { DirectivesModule } from 'src/app/core/shared/directives/directives.modules';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

const components = [
  StoreListComponent,
  StoreDetailComponent
]

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    StoreManagementRoutingModule,
    SharedComponentsModule,
    DirectivesModule,
    NgSlimScrollModule,
    InfiniteScrollModule,
    NgxMaskModule.forRoot()
  ],
  exports: [...components]
})
export class StoreManagementModule { }
