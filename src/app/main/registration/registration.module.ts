import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { AngularMaterialModule } from '../../shared/angular-material.module';
import { RegistrationComponent } from './registration.component';
import { RegistrationRoutingModule } from './registration-routing.module';
import { SharedComponentsModule } from '../../core/shared/components/shared-components.module';
import { CompanyFormComponent } from './company-form/company-form.component';

@NgModule({
  declarations: [
    RegistrationComponent,
    CompanyFormComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    SharedModule,
    AngularMaterialModule,
    RegistrationRoutingModule
  ]
})
export class RegistrationModule { }
