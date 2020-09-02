import { Routes, RouterModule } from '@angular/router';
import { CompanyListComponent } from './company-list/company-list.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: CompanyListComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyManagementRoutingModule {}