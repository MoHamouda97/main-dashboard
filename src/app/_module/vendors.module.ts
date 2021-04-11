import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// ant
import { AntModule } from './ant.module';
// mat
import { MatModule } from './mat.module';
// pipes
import { PipesModule } from './pipes.module';
// shared modules and pieps
import { SharedModule } from './shared.module';
// reusable modules
import { ReusableModule } from './reusable.module';

// vendors
import { BillsComponent } from '../custom/activites/vendors/bills/bills.component';
import { BillsUFormComponent } from '../custom/activites/vendors/bills/bills-u-form/bills-u-form.component';
import { BillsGridComponent } from '../custom/activites/vendors/bills/bills-grid/bills-grid.component';

@NgModule({
  declarations: [
    BillsComponent,
    BillsUFormComponent,
    BillsGridComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // ant module
    AntModule,
    // mat
    MatModule,
    // pipes
    PipesModule,
    // shared
    SharedModule, 
    // reusable
    ReusableModule, 
  ],
  exports: [
    BillsComponent,
    BillsUFormComponent,
    BillsGridComponent,
  ]
})
export class VendorsModule { }
