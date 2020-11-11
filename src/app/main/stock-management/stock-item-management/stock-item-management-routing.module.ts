import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockItemListComponent } from './stock-item-list/stock-item-list.component';

const routes: Routes = [
  {
    path: '',
    component: StockItemListComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockItemManagementRoutingModule {

}