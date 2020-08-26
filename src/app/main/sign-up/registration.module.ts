import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { AngularMaterialModule } from '../../shared/angular-material.module';
import { RegistrationComponent } from './registration.component';
import { RegistrationRoutingModule } from './registration-routing.module';

@NgModule({
  declarations: [RegistrationComponent],
  imports: [
    CommonModule,
    SharedModule,
    AngularMaterialModule,
    RegistrationRoutingModule
  ]
})
export class RegistrationModule { }
