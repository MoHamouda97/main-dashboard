import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// all used pipes
import { CanBeCenterPipe } from 'src/pipes/canBeCenter.pipe';
import { CreateSearchPipe } from 'src/pipes/createSearch.pipe';
import { RenderPipe } from 'src/pipes/render.pipe';
import { RenderSearchPipe } from 'src/pipes/renderSearch.pipe';
import { ReplaceEmptyPipe } from 'src/pipes/replaceEmpty.pipe';



@NgModule({
  declarations: [
    RenderPipe,
    CreateSearchPipe,
    RenderSearchPipe,
    ReplaceEmptyPipe,
    CanBeCenterPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    RenderPipe,
    CreateSearchPipe,
    RenderSearchPipe,
    ReplaceEmptyPipe,
    CanBeCenterPipe,
  ]
})
export class PipesModule { }
