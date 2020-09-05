import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationHeaderComponent } from './registration-header/registration-header.component';
import { SharedModule } from '../../../shared/shared.module';
import { AngularMaterialModule } from '../../../shared/angular-material.module';
import { RegistrationRoutingModule } from 'src/app/main/registration/registration-routing.module';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { AddButtonComponent } from './add-button/add-button.component';

const components = [
  RegistrationHeaderComponent, 
  ToolbarComponent,
  ConfirmDialogComponent,
  AddButtonComponent
]

@NgModule({
  declarations: [...components],
  imports:[
    CommonModule,
    SharedModule,
    AngularMaterialModule,
    RegistrationRoutingModule
  ],
  exports: [...components]
})
export class SharedComponentsModule {
}