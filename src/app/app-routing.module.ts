import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
    {
        path: '', 
        loadChildren: () => import('./scaffold/scaffold.module').then(m => m.ScaffoldModule) 
    },
    {
      path: 'main',
      loadChildren: () => import('./main/main.module').then(m => m.MainModule)
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
    exports: [RouterModule]
})
export class AppRoutingModule { }