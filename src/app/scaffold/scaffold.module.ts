import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AngularMaterialModule } from '../shared/angular-material.module';
import { ScaffoldComponent } from './scaffold.component';
import { ScaffoldRoutingModule } from './scaffold-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { SharedComponentsModule } from '../core/shared/components/shared-components.module';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxMaskModule } from 'ngx-mask';

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
    SharedModule,
    AngularMaterialModule,
    ScaffoldRoutingModule,
    SharedComponentsModule,
    NgSlimScrollModule,
    InfiniteScrollModule,
    NgxMaskModule.forRoot()
  ],
  exports: [
    ...components
  ]
})
export class ScaffoldModule { }
