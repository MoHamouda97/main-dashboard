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
import {ScrollingModule, CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import {MatSortModule} from '@angular/material/sort';
import {MatTabsModule} from '@angular/material/tabs';
import { NgxMaskModule, IConfig } from 'ngx-mask'

// reusable
import { SearchComponent } from 'src/app/custom/reusable/search/search.component';
import { TaskBarComponent } from 'src/app/custom/reusable/task-bar/task-bar.component';
import { LoaderComponent } from '../reusable/loader/loader.component';
import { SearchForApproveComponent } from '../reusable/search-for-approve/search-for-approve.component';
import { CancelOpenComponent } from '../reusable/cancel-open/cancel-open.component';
import { GridComponent } from '../reusable/grid/grid.component';

// general ledger
import { CostCentersComponent } from './../activites/general-ledger/cost-centers/cost-centers.component';
import { EntryTypesComponent } from './../activites/general-ledger/entry-types/entry-types.component';

// saves & banks
import { BanksComponent } from '../activites/safes-banks/banks/banks.component';

// inventory
import { ManufacturersComponent } from '../activites/inventory/manufacturers/manufacturers.component';
import { ItemsGroupComponent } from '../activites/inventory/items-group/items-group.component';
import { ItemsClassesComponent } from '../activites/inventory/items-classes/items-classes.component';
import { CostingItemsComponent } from '../activites/inventory/costing-items/costing-items.component';
import { InventoryTransComponent } from '../activites/inventory/inventory-trans/inventory-trans.component';
import { ItemsInBranchesComponent } from '../activites/inventory/items-in-branches/items-in-branches.component';

//sales
import { CustomerCategoriesComponent } from '../activites/sales/customer-categories/customer-categories.component';
import { DeliveryMethodsComponent } from '../activites/sales/delivery-methods/delivery-methods.component';
import { CommissionPariodComponent } from '../activites/sales/commission-pariod/commission-pariod.component';
import { CustomerRequestsComponent } from '../activites/sales/customer-requests/customer-requests.component';
import { SalesOrderComponent } from '../activites/sales/sales-order/sales-order.component';

// service
import { ServiceTypesComponent } from '../activites/service/service-types/service-types.component';

// basic data
import { PaymentTermsComponent } from '../activites/basic-data/payment-terms/payment-terms.component';
import { PaymentMethodComponent } from '../activites/basic-data/payment-method/payment-method.component';
import { EmpCategoryComponent } from '../activites/basic-data/emp-category/emp-category.component';
import { OtherCategoriesComponent } from '../activites/basic-data/other-categories/other-categories.component';
import { CountriesComponent } from '../activites/basic-data/countries/countries.component'
import { CurrenciesComponent } from '../activites/basic-data/currencies/currencies.component';

// system security
import { ChangePasswordComponent } from '../security/change-password/change-password.component';
import { PreferencesComponent } from '../security/preferences/preferences.component';
import { PostingComponent } from '../security/posting/posting.component';
import { NotificationsComponent } from '../security/notifications/notifications.component';

// pipes
import { RenderPipe } from './../../../pipes/render.pipe';
import { TranslateEnPipe } from './../../../pipes/translateEn.pipe';
import { TranslateArPipe } from './../../../pipes/translateAr.pipe';
import { CreateSearchPipe } from 'src/pipes/createSearch.pipe';
import { RenderSearchPipe } from 'src/pipes/renderSearch.pipe';

// reports
import { ReportsComponent } from '../reports/reports.component';

const routes: Routes = [
  {
    path: '',
   
    component: SystemComponent
  }
];

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

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
    NzAutocompleteModule,
    NzDatePickerModule,
    NzDescriptionsModule,
    NzRadioModule,
    NzTransferModule,
    MatSortModule,
    MatTabsModule,
    NgxMaskModule.forRoot()
],
  declarations: [
      // pipes
      RenderPipe,
      TranslateEnPipe,
      TranslateArPipe,
      CreateSearchPipe,
      RenderSearchPipe,
      // general ledger
      SystemComponent, 
      CostCentersComponent,
      EntryTypesComponent,
      // saves & banks
      BanksComponent,
      // inventory
      ManufacturersComponent,
      ItemsGroupComponent,
      ItemsClassesComponent,
      CostingItemsComponent,
      InventoryTransComponent,
      ItemsInBranchesComponent,
      // sales
      CustomerCategoriesComponent,
      DeliveryMethodsComponent,
      CommissionPariodComponent,
      CustomerRequestsComponent,
      SalesOrderComponent,
      // service
      ServiceTypesComponent,
      // basic data
      PaymentTermsComponent,
      PaymentMethodComponent,
      EmpCategoryComponent,
      OtherCategoriesComponent,
      CountriesComponent,
      CurrenciesComponent,
      // system security
      ChangePasswordComponent,
      PreferencesComponent,
      PostingComponent,
      NotificationsComponent,
      // reusable
      SearchComponent,
      TaskBarComponent,
      LoaderComponent,
      SearchForApproveComponent,
      CancelOpenComponent,
      GridComponent,
      // reports
      ReportsComponent,  
    ],
  providers: [],
  exports: [
    LoaderComponent,
    TranslateEnPipe,
    TranslateArPipe,
  ]
})

export class SystemModule {
} 
