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

// purchases
import { AcknowledgementsComponent } from '../custom/activites/purchases/acknowledgements/acknowledgements.component';
import { PurchaseOrderRequestComponent } from '../custom/activites/purchases/purchase-order-request/purchase-order-request.component';
import { PurchaseInvoiceComponent } from '../custom/activites/purchases/purchase-invoice/purchase-invoice.component';
import { VendorCreditNotesComponent } from '../custom/activites/purchases/vendor-credit-notes/vendor-credit-notes.component';
import { VendorItemsGridComponent } from '../custom/activites/purchases/vendor-credit-notes/vendor-items-grid/vendor-items-grid.component';
import { VendorDiscountsGridComponent } from '../custom/activites/purchases/vendor-credit-notes/vendor-discounts-grid/vendor-discounts-grid.component';
import { VendorCategoriesComponent } from '../custom/activites/purchases/vendor-categories/vendor-categories.component';
import { VendorsGroupsComponent } from '../custom/activites/purchases/vendors-groups/vendors-groups.component';
import { PurchaseOrderComponent } from '../custom/activites/purchases/purchase-order/purchase-order.component';
import { PurchaseShipmentsComponent } from '../custom/activites/purchases/purchase-shipments/purchase-shipments.component';
import { PurchaseShipmentsUFormComponent } from '../custom/activites/purchases/purchase-shipments/purchase-shipments-u-form/purchase-shipments-u-form.component';
import { PurchaseShipmentsInvoicesGridComponent } from '../custom/activites/purchases/purchase-shipments/purchase-shipments-invoices-grid/purchase-shipments-invoices-grid.component';
import { PurchaseShipmentsItemsGridComponent } from '../custom/activites/purchases/purchase-shipments/purchase-shipments-items-grid/purchase-shipments-items-grid.component';
import { PurchaseShipmentsDetailsFormComponent } from '../custom/activites/purchases/purchase-shipments/purchase-shipments-details-form/purchase-shipments-details-form.component';
import { PurchaseShipmentsBrokerFormComponent } from '../custom/activites/purchases/purchase-shipments/purchase-shipments-broker-form/purchase-shipments-broker-form.component';
import { PurchaseShipmentsFollowGridComponent } from '../custom/activites/purchases/purchase-shipments/purchase-shipments-follow-grid/purchase-shipments-follow-grid.component';
import { PurchaseShipmentsContactFormComponent } from '../custom/activites/purchases/purchase-shipments/purchase-shipments-contact-form/purchase-shipments-contact-form.component';
import { PurchaseShipmentsMissedControlesComponent } from '../custom/activites/purchases/purchase-shipments/purchase-shipments-missed-controles/purchase-shipments-missed-controles.component';
import { PurchaseVendorsComponent } from '../custom/activites/purchases/purchase-vendors/purchase-vendors.component';
import { VendorsBasicDataComponent } from '../custom/activites/purchases/purchase-vendors/vendors-basic-data/vendors-basic-data.component';
import { VendorsContactComponent } from '../custom/activites/purchases/purchase-vendors/vendors-contact/vendors-contact.component';
import { PurchaseShippersComponent } from '../custom/activites/purchases/purchase-shippers/purchase-shippers.component';
import { PurchaseCostAddOnsComponent } from '../custom/activites/purchases/purchase-cost-add-ons/purchase-cost-add-ons.component';
import { AddOnsGridComponent } from '../custom/activites/purchases/purchase-cost-add-ons/add-ons-grid/add-ons-grid.component';
import { PurchaseVendorPriceListComponent } from '../custom/activites/purchases/purchase-vendor-price-list/purchase-vendor-price-list.component';
import { PriceListGridComponent } from '../custom/activites/purchases/purchase-vendor-price-list/price-list-grid/price-list-grid.component';

@NgModule({
  declarations: [
    AcknowledgementsComponent,
    PurchaseOrderRequestComponent,
    PurchaseInvoiceComponent,
    VendorCreditNotesComponent,
    VendorItemsGridComponent,
    VendorDiscountsGridComponent,
    VendorCategoriesComponent,
    VendorsGroupsComponent,
    PurchaseOrderComponent,
    PurchaseShipmentsComponent,
    PurchaseShipmentsUFormComponent,
    PurchaseShipmentsInvoicesGridComponent,
    PurchaseShipmentsItemsGridComponent,
    PurchaseShipmentsDetailsFormComponent,
    PurchaseShipmentsBrokerFormComponent,
    PurchaseShipmentsFollowGridComponent,
    PurchaseShipmentsContactFormComponent,
    PurchaseShipmentsMissedControlesComponent,
    PurchaseVendorsComponent,
    VendorsBasicDataComponent,
    VendorsContactComponent,
    PurchaseShippersComponent,
    PurchaseCostAddOnsComponent,
    AddOnsGridComponent,
    PurchaseVendorPriceListComponent,
    PriceListGridComponent
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
    AcknowledgementsComponent,
    PurchaseOrderRequestComponent,
    PurchaseInvoiceComponent,
    VendorCreditNotesComponent,
    VendorItemsGridComponent,
    VendorDiscountsGridComponent,
    VendorCategoriesComponent,
    VendorsGroupsComponent,
    PurchaseOrderComponent,
    PurchaseShipmentsComponent,
    PurchaseShipmentsUFormComponent,
    PurchaseShipmentsInvoicesGridComponent,
    PurchaseShipmentsItemsGridComponent,
    PurchaseShipmentsDetailsFormComponent,
    PurchaseShipmentsBrokerFormComponent,
    PurchaseShipmentsFollowGridComponent,
    PurchaseShipmentsContactFormComponent,
    PurchaseShipmentsMissedControlesComponent,
    PurchaseVendorsComponent,
    VendorsBasicDataComponent,
    VendorsContactComponent,
    PurchaseShippersComponent,
    PurchaseCostAddOnsComponent,
    AddOnsGridComponent,
    PurchaseVendorPriceListComponent,
    PriceListGridComponent
  ]
})

export class PurchasesModule { }
