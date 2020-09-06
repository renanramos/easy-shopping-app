import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EsHasPermissionDirective } from './es-has-permission.directive';

const customDirectives = [
  EsHasPermissionDirective
]

@NgModule({
  declarations: [...customDirectives],
  imports: [
    CommonModule
  ],
  exports: [...customDirectives]
})
export class DirectivesModule { }