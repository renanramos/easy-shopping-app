import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AngularMaterialModule } from '../shared/angular-material.module';
import { ScaffoldComponent } from './scaffold.component';
import { ScaffoldRoutingModule } from './scaffold-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { RouterModule } from '@angular/router';

const components = [
  ScaffoldComponent,
  WelcomeComponent
]

@NgModule({
  declarations: [
    ...components,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    AngularMaterialModule,
    ScaffoldRoutingModule
  ],
  exports: [
    ...components
  ]
})
export class ScaffoldModule { }
