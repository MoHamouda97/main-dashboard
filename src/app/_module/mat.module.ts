import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// mat
import {MatTabsModule} from '@angular/material/tabs';
import {MatRippleModule} from '@angular/material/core';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatTabsModule,
  ],
  exports: [
    MatTabsModule,
    MatRippleModule,
  ]
})
export class MatModule { }
