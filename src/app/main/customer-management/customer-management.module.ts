import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerManagementRoutingModule } from './customer-management-routing.module';
import { SharedComponentsModule } from 'src/app/core/shared/components/shared-components.module';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { DirectivesModule } from '../../core/shared/directives/directives.modules';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

const components = [
  CustomerListComponent,
  CustomerDetailComponent
]

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    CustomerManagementRoutingModule,
    SharedComponentsModule,
    DirectivesModule,
    NgSlimScrollModule,
    InfiniteScrollModule,
    NgxMaskModule.forRoot()
  ],
  exports: [...components]
})
export class CustomerManagementModule { }
