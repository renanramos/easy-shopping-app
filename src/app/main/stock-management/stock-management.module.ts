import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { SharedComponentsModule } from 'src/app/core/shared/components/shared-components.module';
import { DirectivesModule } from 'src/app/core/shared/directives/directives.modules';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxMaskModule } from 'ngx-mask';
import { StockManagementRoutingModule } from './stock-management-routing.module';
import { StockListComponent } from './stock-list/stock-list.component';
import { StockDetailComponent } from './stock-detail/stock-detail.component';

const components = [
  StockListComponent,
  StockDetailComponent
];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    StockManagementRoutingModule,
    SharedComponentsModule,
    DirectivesModule,
    NgSlimScrollModule,
    InfiniteScrollModule,
    NgxMaskModule.forRoot()
  ],
  exports: [...components]
})
export class StockManagementModule { }
