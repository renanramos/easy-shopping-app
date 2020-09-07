import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditCardDetailComponent } from './credit-card-detail/credit-card-detail.component';
import { CreditCardListComponent } from './credit-card-list/credit-card-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/shared/angular-material.module';
import { SharedComponentsModule } from 'src/app/core/shared/components/shared-components.module';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxMaskModule } from 'ngx-mask';

const components = [
  CreditCardDetailComponent,
  CreditCardListComponent
]

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    SharedComponentsModule,
    NgSlimScrollModule,
    InfiniteScrollModule,
    NgxMaskModule.forRoot()
  ],
  exports: [...components]
})
export class CreditCardManagementModule { }
