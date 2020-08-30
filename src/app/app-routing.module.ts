import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
    {
        path: '', 
        loadChildren: () => import('./scaffold/scaffold.module').then(m => m.ScaffoldModule) 
    },
    {
      path: 'registration',
      loadChildren: () => import('./main/registration/registration.module').then(m => m.RegistrationModule)
    },
    {
      path: 'customer-management',
      loadChildren: () => import('./main/customer-management/customer-management.module').then(m => m.CustomerManagementModule)
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
    exports: [RouterModule]
})
export class AppRoutingModule { }