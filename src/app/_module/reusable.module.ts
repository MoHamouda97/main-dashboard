import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AntModule } from './ant.module';
import { MatModule } from './mat.module';
import { PipesModule } from './pipes.module';
import { SharedModule } from './shared.module';

// all reusable components
import { SearchComponent } from '../custom/reusable/search/search.component';
import { TaskBarComponent } from '../custom/reusable/task-bar/task-bar.component';
import { CancelOpenComponent } from '../custom/reusable/cancel-open/cancel-open.component';
import { GridComponent } from '../custom/reusable/grid/grid.component';
import { SearchForApproveComponent } from '../custom/reusable/search-for-approve/search-for-approve.component';
import { SortComponent } from '../custom/reusable/sort/sort.component';
import { BottomBarComponent } from '../custom/reusable/bottom-bar/bottom-bar.component';
import { ContactFormComponent } from '../custom/reusable/contact-form/contact-form.component';


@NgModule({
  declarations: [
    SearchComponent,
    TaskBarComponent,
    SearchForApproveComponent,
    CancelOpenComponent,
    GridComponent,
    SortComponent,
    BottomBarComponent,
    ContactFormComponent   
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
  ],
  exports: [
    SearchComponent,
    TaskBarComponent,
    SearchForApproveComponent,
    CancelOpenComponent,
    GridComponent,
    SortComponent, 
    BottomBarComponent,
    ContactFormComponent
  ]
})
export class ReusableModule { }
