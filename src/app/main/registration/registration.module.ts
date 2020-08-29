import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { AngularMaterialModule } from '../../shared/angular-material.module';
import { RegistrationRoutingModule } from './registration-routing.module';
import { SharedComponentsModule } from '../../core/shared/components/shared-components.module';
import { CompanyFormComponent } from './company-form/company-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomerFormComponent } from './customer-form/customer-form.component';

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
    RegistrationRoutingModule
  ]
})
export class RegistrationModule { }
