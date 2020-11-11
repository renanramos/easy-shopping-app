import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockItemListComponent } from './stock-item-list/stock-item-list.component';
import { StockItemDetailComponent } from './stock-item-detail/stock-item-detail.component';



@NgModule({
  declarations: [StockItemListComponent, StockItemDetailComponent],
  imports: [
    CommonModule
  ]
})
export class StockItemManagementModule { }
