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

//sales
import { CommissionPariodComponent } from '../custom/activites/sales/commission-pariod/commission-pariod.component';
import { CustomerCategoriesComponent } from '../custom/activites/sales/customer-categories/customer-categories.component';
import { CustomerRequestsComponent } from '../custom/activites/sales/customer-requests/customer-requests.component';
import { DeliveryMethodsComponent } from '../custom/activites/sales/delivery-methods/delivery-methods.component';
import { SalesOrderComponent } from '../custom/activites/sales/sales-order/sales-order.component';
import { SalesInvoiceComponent } from '../custom/activites/sales/sales-invoice/sales-invoice.component';
import { InvoiceUFormComponent } from '../custom/activites/sales/sales-invoice/invoice-u-form/invoice-u-form.component';
import { InvoiceGridComponent } from '../custom/activites/sales/sales-invoice/invoice-grid/invoice-grid.component';
import { SalesQuotationsComponent } from '../custom/activites/sales/sales-quotations/sales-quotations.component';
import { QuotationsGridComponent } from '../custom/activites/sales/sales-quotations/quotations-grid/quotations-grid.component';
import { QuotationsUFormComponent } from '../custom/activites/sales/sales-quotations/quotations-u-form/quotations-u-form.component';
import { ReservationComponent } from '../custom/activites/sales/reservation/reservation.component';
import { ReservationUFormComponent } from '../custom/activites/sales/reservation/reservation-u-form/reservation-u-form.component';
import { ReservationGridComponent } from '../custom/activites/sales/reservation/reservation-grid/reservation-grid.component';
import { PriceListComponent } from '../custom/activites/sales/price-list/price-list.component';
import { PriseListUFormComponent } from '../custom/activites/sales/price-list/prise-list-u-form/prise-list-u-form.component';
import { PriceListGridComponent } from '../custom/activites/sales/price-list/price-list-grid/price-list-grid.component';
import { ComRatiosComponent } from '../custom/activites/sales/com-ratios/com-ratios.component';
import { ComRatiosUFormComponent } from '../custom/activites/sales/com-ratios/com-ratios-u-form/com-ratios-u-form.component';
import { ComRatiosGridComponent } from '../custom/activites/sales/com-ratios/com-ratios-grid/com-ratios-grid.component';
import { ComPeriodTermsComponent } from '../custom/activites/sales/com-period-terms/com-period-terms.component';
import { ComPeriodUFormComponent } from '../custom/activites/sales/com-period-terms/com-period-u-form/com-period-u-form.component';
import { ComPeriodGridComponent } from '../custom/activites/sales/com-period-terms/com-period-grid/com-period-grid.component';
import { ComPeriodPaymentFormComponent } from '../custom/activites/sales/com-period-terms/com-period-payment-form/com-period-payment-form.component';

@NgModule({
  declarations: [
    CustomerCategoriesComponent,
    DeliveryMethodsComponent,
    CommissionPariodComponent,
    CustomerRequestsComponent,
    SalesOrderComponent, 
    SalesInvoiceComponent,
    InvoiceUFormComponent,
    InvoiceGridComponent,
    SalesQuotationsComponent,
    QuotationsGridComponent,
    QuotationsUFormComponent,
    ReservationComponent,
    ReservationUFormComponent,
    ReservationGridComponent,
    PriceListComponent,
    PriseListUFormComponent,
    PriceListGridComponent,
    ComRatiosComponent,
    ComRatiosUFormComponent,
    ComRatiosGridComponent,
    ComPeriodTermsComponent,
    ComPeriodUFormComponent,
    ComPeriodGridComponent,
    ComPeriodPaymentFormComponent
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
    CustomerCategoriesComponent,
    DeliveryMethodsComponent,
    CommissionPariodComponent,
    CustomerRequestsComponent,
    SalesOrderComponent,
    SalesInvoiceComponent,
    InvoiceUFormComponent,
    InvoiceGridComponent,
    SalesQuotationsComponent,
    QuotationsGridComponent,
    QuotationsUFormComponent,
    ReservationComponent,
    ReservationUFormComponent,
    ReservationGridComponent,
    PriceListComponent,
    PriseListUFormComponent,
    PriceListGridComponent,
    ComRatiosComponent,
    ComRatiosUFormComponent,
    ComRatiosGridComponent,
    ComPeriodTermsComponent,
    ComPeriodUFormComponent,
    ComPeriodGridComponent,
    ComPeriodPaymentFormComponent
  ]
})
export class SalesModule { }
