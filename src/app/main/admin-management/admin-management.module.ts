import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminListComponent } from './admin-list/admin-list.component';
import { AdminDetailComponent } from './admin-detail/admin-detail.component';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { PipeModule } from 'src/app/core/shared/pipe/pipe.module';
import { SharedComponentsModule } from 'src/app/core/shared/components/shared-components.module';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AdminManagementRoutingModule } from './admin-management-routing.module';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

const components = [
  AdminListComponent,
  AdminDetailComponent
]

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    AdminManagementRoutingModule,
    PipeModule,
    SharedComponentsModule,
    NgSlimScrollModule,
    InfiniteScrollModule,
    NgxMaskModule.forRoot()
  ],
  exports: [...components]
})
export class AdminManagementModule { }
