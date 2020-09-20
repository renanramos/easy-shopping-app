import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainComponent } from './main.component';
import { AuthGuard } from '../core/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'customer-management',
        loadChildren: () => import('./customer-management/customer-management.module').then(m => m.CustomerManagementModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'company-management',
        loadChildren: () => import('./company-management/company-management.module').then(m => m.CompanyManagementModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'store-management',
        loadChildren: () => import('./store-management/store-management.module').then(m => m.StoreManagementModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'user-management',
        loadChildren: () => import('./user-management/user-management.module').then(m => m.UserManagementModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'product-category-management',
        loadChildren: () => import('./product-category-management/product-category-management.module').then(m => m.ProductCategoryManagementModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'product-subcategory-management',
        loadChildren: () => import('./subcategory-management/subcategory-management.module').then(m => m.SubcategoryManagementModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'admin-management',
        loadChildren: () => import('./admin-management/admin-management.module').then(m => m.AdminManagementModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'registration',
        loadChildren: () => import('./registration/registration.module').then(m => m.RegistrationModule)
      }
    ]
  }  
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {}