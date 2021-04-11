import { SystemComponent } from './system.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

//import { NgxMaskModule, IConfig } from 'ngx-mask'

// ant modules
import { AntModule } from 'src/app/_module/ant.module';

// mat modules
import { MatModule } from 'src/app/_module/mat.module';

// pipes
import { PipesModule } from 'src/app/_module/pipes.module';

// reusable
import { ReusableModule } from 'src/app/_module/reusable.module';

// shared module
import { SharedModule } from 'src/app/_module/shared.module';

// general ledger
import { GlModule } from 'src/app/_module/gl.module';

// saves & banks
import { SavesBanksModule } from 'src/app/_module/saves-banks.module';

// inventory
import { InventoryModule } from 'src/app/_module/inventory.module';

//sales
import { SalesModule } from 'src/app/_module/sales.module';

// purchases
import { PurchasesModule } from 'src/app/_module/purchases.module';

// vendors
import { VendorsModule } from 'src/app/_module/vendors.module';

// service
import { ServicesModule } from 'src/app/_module/services.module';

// basic data
import { BasicDataModule } from 'src/app/_module/basic-data.module';

// system security
import { SecurityModule } from 'src/app/_module/security.module';

// reports
import { ReportsModule } from 'src/app/_module/reports.module';


const routes: Routes = [
  {
    path: '',
   
    component: SystemComponent
  }
];

//export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule, 
    CommonModule, 
    RouterModule.forChild(routes), 
    // pipes
    PipesModule,
    // reusable
    ReusableModule,
    // shared
    SharedModule,     
    // general ledger
    GlModule,
    // saves & banks
    SavesBanksModule, 
    // inventory
    InventoryModule,
    // sales
    SalesModule,
    // purchases
    PurchasesModule, 
    // vendors
    VendorsModule,
    // service
    ServicesModule,
    // basic data
    BasicDataModule,
    // system security
    SecurityModule, 
    // reports
    ReportsModule,                          
    // ant module
    AntModule,
    // mat
    MatModule,
    //NgxMaskModule.forRoot()
  ],
  declarations: [SystemComponent],
  providers: [],
})

export class SystemModule {
} 
