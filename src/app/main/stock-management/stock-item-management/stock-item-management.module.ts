import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockItemListComponent } from './stock-item-list/stock-item-list.component';
import { StockItemDetailComponent } from './stock-item-detail/stock-item-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { SharedComponentsModule } from 'src/app/core/shared/components/shared-components.module';
import { DirectivesModule } from 'src/app/core/shared/directives/directives.modules';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxMaskModule } from 'ngx-mask';
import { StockItemManagementRoutingModule } from './stock-item-management-routing.module';
import { StockItemReportComponent } from './stock-item-report/stock-item-report.component';

const components = [
  StockItemDetailComponent,
  StockItemListComponent, 
  StockItemReportComponent
]

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    StockItemManagementRoutingModule,
    SharedComponentsModule,
    DirectivesModule,
    NgSlimScrollModule,
    InfiniteScrollModule,
    NgxMaskModule.forRoot()
  ],
  exports: [...components]
})
export class StockItemManagementModule { }
