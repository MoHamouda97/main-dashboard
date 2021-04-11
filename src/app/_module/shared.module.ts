import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// shared pipes
import { TranslateEnPipe } from 'src/pipes/translateEn.pipe';
import { TranslateArPipe } from 'src/pipes/translateAr.pipe';
// shared components
import { LoaderComponent } from '../custom/reusable/loader/loader.component';



@NgModule({
  declarations: [
    TranslateEnPipe,
    TranslateArPipe,
    LoaderComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TranslateEnPipe,
    TranslateArPipe,
    LoaderComponent
  ]
})
export class SharedModule { }
