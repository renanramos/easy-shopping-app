import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationHeaderComponent } from './registration-header/registration-header.component';
import { SharedModule } from '../../../shared/shared.module';
import { AngularMaterialModule } from '../../../shared/angular-material.module';
import { RegistrationRoutingModule } from 'src/app/main/registration/registration-routing.module';

const components = [
  RegistrationHeaderComponent
]

@NgModule({
  declarations: [RegistrationHeaderComponent],
  imports:[
    CommonModule,
    SharedModule,
    AngularMaterialModule,
    RegistrationRoutingModule
  ],
  exports: [RegistrationHeaderComponent]
})
export class SharedComponentsModule {
}