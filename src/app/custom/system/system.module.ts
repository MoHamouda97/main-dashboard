import { SystemComponent } from './system.component';
import { NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { MatRippleModule } from '@angular/material';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';

// reusable
import { SearchComponent } from 'src/app/custom/reusable/search/search.component';
import { TaskBarComponent } from 'src/app/custom/reusable/task-bar/task-bar.component';
import { LoaderComponent } from '../reusable/loader/loader.component';

// general ledger
import { CostCentersComponent } from './../activites/general-ledger/cost-centers/cost-centers.component';
import { EntryTypesComponent } from './../activites/general-ledger/entry-types/entry-types.component';

const routes: Routes = [
  {
    path: '',
   
    component: SystemComponent
  }
];

@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule, 
    CommonModule, 
    RouterModule.forChild(routes),  
    NzMessageModule, 
    NzAlertModule,
    NzIconModule,
    NzFormModule,
    NzInputModule,  
    NzCheckboxModule,  
    NzSelectModule,
    NzNotificationModule,
    NzModalModule,
    NzTableModule,
    MatRippleModule,
    NzToolTipModule,
    ScrollingModule,
    NzPopconfirmModule,
    NzDropDownModule,
    NzAutocompleteModule
],
  declarations: [
      SystemComponent, 
      CostCentersComponent,
      EntryTypesComponent,
      SearchComponent,
      TaskBarComponent,
      LoaderComponent
    ],
  providers: []
})

export class SystemModule {
} 
