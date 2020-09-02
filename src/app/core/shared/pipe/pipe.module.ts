import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhonePipe } from './phone.pipe';

const customPipes = [
  PhonePipe
]

@NgModule({
  declarations: [...customPipes],
  imports: [
    CommonModule
  ],
  exports: [...customPipes]
})
export class PipeModule { }
