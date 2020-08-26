import { Routes, RouterModule } from "@angular/router";
import { NgModule } from '@angular/core';

import { RegistrationComponent } from './registration.component';
import { CompanyFormComponent } from './company-form/company-form.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'customer'
  },
  {
    path: 'customer',
    component: RegistrationComponent
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
