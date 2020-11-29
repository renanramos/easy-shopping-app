import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { SharedComponentsModule } from 'src/app/core/shared/components/shared-components.module';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { AddressManagementModule } from './address-management/address-management.module';
import { CreditCardManagementModule } from './credit-card-management/credit-card-management.module';
import { CustomerFormComponent } from './user-profile/customer-profile/customer-form.component';
import { CompanyFormComponent } from './user-profile/company-profile/company-form.component';
import { DirectivesModule } from 'src/app/core/shared/directives/directives.modules';
import { ShoppingCartItemsComponent } from './user-profile/shopping-cart-items/shopping-cart-items.component';
import { OrderManagementModule } from './order-management/order-management.module';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

const components = [
  UserProfileComponent,
  CustomerFormComponent,
  CompanyFormComponent,
  ShoppingCartItemsComponent
]

@NgModule({
  declarations: [...components ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    UserManagementRoutingModule,
    DirectivesModule,
    SharedComponentsModule,
    AddressManagementModule,
    CreditCardManagementModule,
    OrderManagementModule,
    NgSlimScrollModule,
    InfiniteScrollModule,
    NgxMaskModule.forRoot()
  ],
  exports: [...components]
})
export class UserManagementModule { }