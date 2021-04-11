import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FrmService } from 'src/services/frm/frm.service';
import { DatabindingService } from 'src/services/databinding.service';
import {operators} from './../../../../settings/operators';
import * as lang from './../../../../settings/lang';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import * as $ from 'jquery';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  @Input('isDbLoading') isDbLoading = true;
  @Input('fields') fields = [];
  tableTitle;
  lang;
  searchValue;
  operatorValue;
  searchBy;
  SQLstm;
  searchOption;
  searchOperator = "=";

  openOperator = false;
  openValue = false
  openBtn = false;

  operators = operators; 
  isSearching = false;

  isShowSearch= false;

  private unsubscribe$: Subject<any> = new Subject<any>();

  constructor(private service: FrmService, private binding: DatabindingService) { }

  ngOnInit() {
    this.tableTitle = localStorage.getItem('frmName').slice(3)
    switch (localStorage.getItem('frmName')) {
      case 'FrmCostCenters':
        this.tableTitle = 'CostCenters'
        break;
      case  'FrmEntryType':
        this.tableTitle = 'AccTransTypes';
        break;
      case  'FrmCustomersRequests':
        this.tableTitle = 'PersonsRequests';
        break; 
      case  'FrmSalesOrders':
        this.tableTitle = 'SalesOrderHdr';
        break;  
      case  'FrmVouchers': 
        this.tableTitle = 'ItemsInOutH';
        break;  
      case  'FrmJournal':
        this.tableTitle = 'AccJournalHdr';
        break; 
      case  'FrmAccounts':
        this.tableTitle = 'Accounts';
        break; 
      case  'FrmItemsMPG':
        this.tableTitle = 'ItemsMPGCategory';
        break;  
      case  'FrmStores':
        this.tableTitle = 'Stores';
        break; 
      case  'FrmItems':
        this.tableTitle = 'Items';
        break; 
      case  'FrmItemsCat1':
        this.tableTitle = 'ItemCategory1';
        break; 
      case  'FrmItemsCat2':
        this.tableTitle = 'ItemCategory2';
        break;
      case  'FrmItemsCat3':
        this.tableTitle = 'ItemCategory3';
        break; 
      case  'FrmItemsRequest':
        this.tableTitle = 'ItemRequestHdr';
        break; 
      case  'FrmPurAck':
        this.tableTitle = 'PurAcknowledgementsHdr';
        break;   
      case  'FrmPORequest':
        this.tableTitle = 'PurchaseOrderHdr';
        break; 
      case  'FrmPurchase':
        this.tableTitle = 'PurchaseHdr';
        break;
      case  'FrmPurchaseReturns':
        this.tableTitle = 'PurchaseReturnHdr';
        break;  
      case  'FrmVendorCategory':
        this.tableTitle = 'PurVendorCategories';
        break; 
      case  'FrmPersonsGroups':
        this.tableTitle = 'PersonsGroups';
        break;
      case  'FrmPurchaseOrder':
        this.tableTitle = 'PurchaseOrderHdr';
        break; 
      case  'FrmPurShipments':
        this.tableTitle = 'PurShipmentsHdr';
        break; 
      case  'FrmVendors':
        this.tableTitle = 'PurShipmentsHdr';
        break;  
      case  'FrmPurShippers':
        this.tableTitle = 'PurShippers';
        break; 
      case  'FrmBills':
        this.tableTitle = 'PurchaseHdr';
        break;  
      case  'FrmPayables':
        this.tableTitle = 'PayablesHdr';
        break; 
      case  'FrmReceivables':
        this.tableTitle = 'ReceivablesHdr';
        break; 
      case  'FrmSales':
        this.tableTitle = 'SalesHdr';
        break; 
      case  'FrmSalQuotations':
        this.tableTitle = 'SalQuotationsHdr';
        break;   
      case  'FrmReserv':
        this.tableTitle = 'ReservationHdr';
        break; 
      case  'FrmComRatios':
        this.tableTitle = 'ScmRatiosHdr';
        break; 
      case  'FrmComSalesmen':
        this.tableTitle = 'ScmSalesMen';
        break;                                                                                                                                                                                                                                                    
    }

    // extract SQL statement
    this.SQLstm = localStorage.getItem("sqlStm");   

    //#region 

        // dealing with page direction
        // Mohammed Hamouda - 29/12/2020 => v1 (detect language changing)

        this.binding.checkIsLangChanged.subscribe(
          res => {
            if (res != null)
              this.lang = (res == 'EN') ? lang.en : lang.ar;
          }
        );

        this.lang = (localStorage.getItem('lang') == 'EN') ? lang.en : lang.ar;

    //#endregion 
    
    //#region 

        // get all data
        // Mohammed Hamouda - 29/12/2020

        this.binding.checkAllData.pipe(
          takeUntil(this.unsubscribe$)
        ).subscribe(
          res => {
            if (res != null && res != false) {
              this.getData(res);

              this.openOperator = false;
              this.openValue = false
              this.openBtn = false;
            }              
          }
        );

    //#endregion     
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.binding.sendingSearchData(null);
  }

  //#region 

    // handle search functionality 
    // Mohammed Hamouda - 31/12/2020 => v2 (just update getData() to do async work with task bar)

    getData(isFromTaskBar) {
      this.isSearching = true;

      let cri;

      if (this.searchOperator == 'Like') {
          (isFromTaskBar == false) 
            ? cri = `${this.tableTitle}.${this.searchOption} like '**${this.searchValue}**'`
            : cri = '';
      } else {
        (isFromTaskBar == false) 
          ? cri = `${this.tableTitle}.${this.searchOption} ${this.searchOperator} '${this.searchValue}'`
          : cri = '';
      }

      this.service.loadData(localStorage.getItem('sqlStm'), cri).subscribe(
        res => {
          this.isSearching = false;
          this.binding.sendingSearchData(res);          
        },
        err => {
        }
      )
    }

    searchByClick() {
      this.getData(false);
    }

    searchByEnter() {
      this.getData(false);
    }

  //#endregion

  //#region 

    // check lang

    getLang() {
      return localStorage.getItem('lang');
    }

  //#endregion

  //#region 

    // toggle search
    // Mohammed Hamouda - 3/11/2021

    changeSearchStatus(){
      this.isShowSearch = !this.isShowSearch
    }

  //#endregion

  ngOnChanges(changes: SimpleChanges) {
    // check new table fields
    const isNewFields = setInterval(() => {
      if (typeof (changes.fields) == 'undefined') {
        null;
      } else {
        this.fields = changes.fields.currentValue;
        this.searchOption = this.fields[0];
        clearInterval(isNewFields);
      }
    }, 1000);

    // check new table fields
    const isNewDbLoad = setInterval(() => {
      if (typeof (changes.isDbLoading) == 'undefined') {
        null;
      } else {
        this.isDbLoading = changes.isDbLoading.currentValue;
        clearInterval(isNewDbLoad);
      }
    }, 1000);    

  }
}
