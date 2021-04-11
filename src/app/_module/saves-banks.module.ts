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

// saves-banks
import { BanksComponent } from '../custom/activites/safes-banks/banks/banks.component';
import { PayablesReceivableComponent } from '../custom/activites/safes-banks/payables-receivable/payables-receivable.component';
import { PayablesReceivableUFormComponent } from '../custom/activites/safes-banks/payables-receivable/payables-receivable-u-form/payables-receivable-u-form.component';
import { PayablesReceivableInvoiceGridComponent } from '../custom/activites/safes-banks/payables-receivable/payables-receivable-invoice-grid/payables-receivable-invoice-grid.component';
import { PayablesReceivableExpensesGridComponent } from '../custom/activites/safes-banks/payables-receivable/payables-receivable-expenses-grid/payables-receivable-expenses-grid.component';

@NgModule({
  declarations: [
    BanksComponent,
    PayablesReceivableComponent,
    PayablesReceivableUFormComponent,
    PayablesReceivableInvoiceGridComponent,
    PayablesReceivableExpensesGridComponent
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
    BanksComponent,
    PayablesReceivableComponent,
    PayablesReceivableUFormComponent,
    PayablesReceivableInvoiceGridComponent,
    PayablesReceivableExpensesGridComponent
  ]
})
export class SavesBanksModule { }
