import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainComponent } from './main.component';
import { AuthGuard } from '../core/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },
  {
    path: 'customer-management',
    loadChildren: () => import('./customer-management/customer-management.module').then(m => m.CustomerManagementModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'company-management',
    loadChildren: () => import('./company-management/company-management.module').then(m => m.CompanyManagementModule),
    canActivate: [AuthGuard]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {}