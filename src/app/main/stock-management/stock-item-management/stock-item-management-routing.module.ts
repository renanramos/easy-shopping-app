import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockItemListComponent } from './stock-item-list/stock-item-list.component';
import { StockItemReportComponent } from './stock-item-report/stock-item-report.component';

const routes: Routes = [
  {
    path: '',
    component: StockItemListComponent
  },
  {
    path: 'report/:id',
    component: StockItemReportComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockItemManagementRoutingModule {

}