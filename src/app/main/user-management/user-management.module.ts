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
import { AddressDetailComponent } from './address-management/address-detail/address-detail.component';
import { AddressManagementModule } from './address-management/address-management.module';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

const components = [
  UserProfileComponent
]

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    UserManagementRoutingModule,
    SharedComponentsModule,
    AddressManagementModule,
    NgSlimScrollModule,
    InfiniteScrollModule,
    NgxMaskModule.forRoot()
  ],
  exports: [...components]
})
export class UserManagementModule { }