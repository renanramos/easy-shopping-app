import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { SharedComponentsModule } from 'src/app/core/shared/components/shared-components.module';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';

const components = [
  MainComponent
]

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    MainRoutingModule,
    SharedComponentsModule
  ],
  exports: [...components]
})
export class MainModule { }
