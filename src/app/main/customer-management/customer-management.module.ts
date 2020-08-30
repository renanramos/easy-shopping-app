import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerManagementRoutingModule } from './customer-management-routing.module';
import { SharedComponentsModule } from 'src/app/core/shared/components/shared-components.module';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { CustomerListComponent } from './customer-list/customer-list.component';

const components = [
  CustomerListComponent
]

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    AngularMaterialModule,
    CustomerManagementRoutingModule,
    SharedComponentsModule
  ],
  exports: [...components]
})
export class CustomerManagementModule { }
