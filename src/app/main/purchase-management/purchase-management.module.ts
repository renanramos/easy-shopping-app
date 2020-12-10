import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseReportComponent } from './purchase-report/purchase-report.component';
import { PurchaseManagementRoutingModule } from './purchase-management-routing.module';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/core/shared/directives/directives.modules';
import { SharedComponentsModule } from 'src/app/core/shared/components/shared-components.module';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { ChartsModule } from 'ng2-charts';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

const components = [
  PurchaseReportComponent
]

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    PurchaseManagementRoutingModule,
    DirectivesModule,
    SharedComponentsModule,
    NgSlimScrollModule,
    InfiniteScrollModule,
    NgxMaskModule.forRoot(),
    ChartsModule
  ],
  exports: [...components]
})
export class PurchaseManagementModule { }
