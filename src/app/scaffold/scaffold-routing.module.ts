import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { ScaffoldComponent } from './scaffold.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  {
    path: '',
    component: ScaffoldComponent,
    children: [
      {
        path: '',
        component: WelcomeComponent
      },
      {
        path: 'main',
        loadChildren: () => import('./../main/main.module').then(m => m.MainModule)
      }
    ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ScaffoldRoutingModule { }