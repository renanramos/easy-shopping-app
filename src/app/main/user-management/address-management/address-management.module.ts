import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxMaskModule, IConfig } from 'ngx-mask';

import { AngularMaterialModule } from '../../../shared/angular-material.module';
import { SharedComponentsModule } from '../../../core/shared/components/shared-components.module';
import { AddressDetailComponent } from './address-detail/address-detail.component';
import { AddressListComponent } from './address-list/address-list.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

const components = [
  AddressDetailComponent,
  AddressListComponent
]

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    SharedComponentsModule,
    NgSlimScrollModule,
    InfiniteScrollModule,
    NgxMaskModule.forRoot()
  ],
  exports: [...components]
})
export class AddressManagementModule { }