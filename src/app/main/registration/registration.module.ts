import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { AngularMaterialModule } from '../../shared/angular-material.module';
import { RegistrationRoutingModule } from './registration-routing.module';
import { SharedComponentsModule } from '../../core/shared/components/shared-components.module';
import { CompanyFormComponent } from './company-form/company-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  declarations: [
    CompanyFormComponent,
    CustomerFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    SharedModule,
    AngularMaterialModule,
    RegistrationRoutingModule,
    NgxMaskModule.forRoot()
  ]
})
export class RegistrationModule { }
