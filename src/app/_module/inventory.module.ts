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

// inventory
import { CostingItemsComponent } from '../custom/activites/inventory/costing-items/costing-items.component';
import { InventoryTransComponent } from '../custom/activites/inventory/inventory-trans/inventory-trans.component';
import { ItemsClassesComponent } from '../custom/activites/inventory/items-classes/items-classes.component';
import { ItemsGroupComponent } from '../custom/activites/inventory/items-group/items-group.component';
import { ItemsInBranchesComponent } from '../custom/activites/inventory/items-in-branches/items-in-branches.component';
import { ManufacturersComponent } from '../custom/activites/inventory/manufacturers/manufacturers.component';
import { VouchersComponent } from '../custom/activites/inventory/vouchers/vouchers.component';
import { MpgComponent } from '../custom/activites/inventory/mpg/mpg.component';
import { StoresComponent } from '../custom/activites/inventory/stores/stores.component';
import { ItemsComponent } from '../custom/activites/inventory/items/items.component';
import { ItemsCatVOneComponent } from '../custom/activites/inventory/items-cat-v-one/items-cat-v-one.component';
import { ItemsCatVTwoComponent } from '../custom/activites/inventory/items-cat-v-two/items-cat-v-two.component';
import { ItemsCatVThreeComponent } from '../custom/activites/inventory/items-cat-v-three/items-cat-v-three.component';
import { LinkScreenComponent } from '../custom/activites/inventory/link-screen/link-screen.component';
import { ItemExpireListComponent } from '../custom/activites/inventory/item-expire-list/item-expire-list.component';
import { StockRequestComponent } from '../custom/activites/inventory/stock-request/stock-request.component';

@NgModule({
  declarations: [
    ManufacturersComponent,
    ItemsGroupComponent,
    ItemsClassesComponent,
    CostingItemsComponent,
    InventoryTransComponent,
    ItemsInBranchesComponent,
    VouchersComponent, 
    MpgComponent, 
    StoresComponent, 
    ItemsComponent, 
    ItemsCatVOneComponent,
    ItemsCatVTwoComponent,
    ItemsCatVThreeComponent,
    LinkScreenComponent,
    ItemExpireListComponent,
    StockRequestComponent
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
    ManufacturersComponent,
    ItemsGroupComponent,
    ItemsClassesComponent,
    CostingItemsComponent,
    InventoryTransComponent,
    ItemsInBranchesComponent,
    VouchersComponent, 
    MpgComponent,
    StoresComponent, 
    ItemsComponent,
    ItemsCatVOneComponent,
    ItemsCatVTwoComponent,
    ItemsCatVThreeComponent,
    LinkScreenComponent,
    ItemExpireListComponent,
    StockRequestComponent
  ]
})
export class InventoryModule { }
