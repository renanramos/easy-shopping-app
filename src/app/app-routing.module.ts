import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'products'},
    {path: 'products', loadChildren: () => import('./modules/main/main.module').then(m => m.MainModule) },
    {path: 'login', loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }