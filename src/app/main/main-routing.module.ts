import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },
  {
    path: 'customer-management',
    loadChildren: () => import('./customer-management/customer-management.module').then(m => m.CustomerManagementModule)
  },
  {
    path: 'company-management',
    loadChildren: () => import('./company-management/company-management.module').then(m => m.CompanyManagementModule)
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {}