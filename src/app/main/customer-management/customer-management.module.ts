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
    NgSlimScrollModule,
    InfiniteScrollModule
  ],
  exports: [...components]
})
export class CustomerManagementModule { }
