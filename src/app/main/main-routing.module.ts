import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainComponent } from './main.component';
import { AuthGuard } from '../core/guard/auth.guard';
import { AppAuthGuard } from '../core/guard/app-auth-guard.guard';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'customer-management',
        loadChildren: () => import('./customer-management/customer-management.module').then(m => m.CustomerManagementModule),
        canActivate: [AppAuthGuard]
      },
      {
        path: 'company-management',
        loadChildren: () => import('./company-management/company-management.module').then(m => m.CompanyManagementModule),
        canActivate: [AppAuthGuard]
      },
      {
        path: 'store-management',
        loadChildren: () => import('./store-management/store-management.module').then(m => m.StoreManagementModule),
        canActivate: [AppAuthGuard]
      },
      {
        path: 'user-management',
        loadChildren: () => import('./user-management/user-management.module').then(m => m.UserManagementModule),
        canActivate: [AppAuthGuard]
      },
      {
        path: 'product-management',
        loadChildren: () => import('./product-management/product-management.module').then(m => m.ProductManagementModule),
        canActivate: [AppAuthGuard]
      },
      {
        path: 'product-category-management',
        loadChildren: () => import('./product-category-management/product-category-management.module').then(m => m.ProductCategoryManagementModule),
        canActivate: [AppAuthGuard]
      },
      {
        path: 'product-subcategory-management',
        loadChildren: () => import('./subcategory-management/subcategory-management.module').then(m => m.SubcategoryManagementModule),
        canActivate: [AppAuthGuard]
      },
      {
        path: 'admin-management',
        loadChildren: () => import('./admin-management/admin-management.module').then(m => m.AdminManagementModule),
        canActivate: [AppAuthGuard]
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