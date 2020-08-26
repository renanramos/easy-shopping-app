import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { ScaffoldComponent } from './scaffold.component';

const routes: Routes = [
  {
    path: '', 
    component: ScaffoldComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./../main/product-management/product-management.module').then(m => m.ProductManagementModule)
      },
      {
        path: 'registration',
        loadChildren: () => import('../main/registration/registration.module').then(m => m.RegistrationModule)
      }
    ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ScaffoldRoutingModule { }