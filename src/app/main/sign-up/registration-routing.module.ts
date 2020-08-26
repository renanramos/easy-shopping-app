import { Routes, RouterModule } from "@angular/router";
import { RegistrationComponent } from './registration.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: RegistrationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationRoutingModule {

}
