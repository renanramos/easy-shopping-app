import { Routes, RouterModule } from "@angular/router";
import { NgModule } from '@angular/core';

import { CompanyFormComponent } from './company-form/company-form.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'customer'
  },
  {
    path: 'customer',
    component: CustomerFormComponent
  },
  {
    path: 'company',
    component: CompanyFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationRoutingModule {

}
