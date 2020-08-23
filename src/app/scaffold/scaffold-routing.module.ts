import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { ScaffoldComponent } from './scaffold.component';
import { ProductsListComponent } from '../main/product-management/products-list/products-list.component';

const routes: Routes = [
  {
    path: '', 
    component: ScaffoldComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./../main/product-management/product-management.module').then(m => m.ProductManagementModule)
      }
    ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ScaffoldRoutingModule { }