import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// general ledger
import { AccountBudgetComponent } from '../custom/activites/general-ledger/account-budget/account-budget.component';
import { CostCenterBudgetComponent } from '../custom/activites/general-ledger/cost-center-budget/cost-center-budget.component';
import { CostCentersComponent } from '../custom/activites/general-ledger/cost-centers/cost-centers.component';
import { EntryTypesComponent } from '../custom/activites/general-ledger/entry-types/entry-types.component';
import { JournalEntryComponent } from '../custom/activites/general-ledger/journal-entry/journal-entry.component';
import { AccountChartComponent } from '../custom/activites/general-ledger/account-chart/account-chart.component';

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


@NgModule({
  declarations: [
    CostCentersComponent,
    EntryTypesComponent,
    JournalEntryComponent,
    CostCenterBudgetComponent,
    AccountBudgetComponent, 
    AccountChartComponent,   
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
    CostCentersComponent,
    EntryTypesComponent,
    JournalEntryComponent,
    CostCenterBudgetComponent,
    AccountBudgetComponent,
    AccountChartComponent
  ]
})
export class GlModule { }
