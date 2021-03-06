import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { SharedComponentsModule } from 'src/app/core/shared/components/shared-components.module';
import { CompanyManagementRoutingModule } from './company-management-routing.module';
import { CompanyListComponent } from './company-list/company-list.component';
import { PipeModule } from 'src/app/core/shared/pipe/pipe.module';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { DirectivesModule } from 'src/app/core/shared/directives/directives.modules';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

const components = [
  CompanyListComponent
]

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    CompanyManagementRoutingModule,
    PipeModule,
    SharedComponentsModule,
    DirectivesModule,
    NgSlimScrollModule,
    InfiniteScrollModule,
    NgxMaskModule.forRoot()
  ],
  exports: [...components]
})
export class CompanyManagementModule { }
