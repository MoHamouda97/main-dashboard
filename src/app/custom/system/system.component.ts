import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { DatabindingService } from 'src/services/databinding.service';
import { FrmService } from 'src/services/frm/frm.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as $ from 'jquery';
import * as lang from './../../../settings/lang';
import { takeUntil } from 'rxjs/operators';
import { isArray } from 'rxjs/internal/util/isArray';
import { BnNgIdleService } from 'bn-ng-idle';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css']
})
export class SystemComponent implements OnInit {
  // system var
  subscription: Subscription;
  lang;
  frmType;
  objID;
  dbTableName;
  system;

  // search var
  fields: any = [];
  isDbLoading = true;

  // child var
  data: any[] = [];
  isReset = false;
  isDelete = false;
  isSaveOrUpdate = false;
  isRefresh = false;
  isReporting = false;
  isFullView = false;
  isPosting = false;
  dataRecived;
  emailRecived;

  // loading var
  isLoading = true;
  isNewLoad = true;
  isTableSearch = false;

  // secutiy variables
  sql;
  sqlStm;
  userRights;

  // subscription var
  destroyed = new Subject();

  // reports var
  lines;
  repIDs:any[] = [];
  repTitles:any[] = [];
  repObj:any[] = [];
  isAvailableReport = true;
  isDisplayRep = false;
  isPrintRip = false;
  isRepVisible = false;
  selectedRep = undefined;

  // modals variables
  isVisible = false;

  // form title
  whatMode = "Add";

  // tbl page number;
  tblData = [];

  // word to be translated
  wordToBeTranslated;

  // cost items var
  costItems: any;

  // vendors var
  vendors: any;

  // hold data before filter var  
  original: any;

  // handle display according to application part
  isSimpleTransaction: boolean = false;
  isApproval: boolean = false;
  isCancle: boolean = false;
  isShowReport: boolean = false;

  // header
  header: any = {
    gridIndex : "",
    childs: "",
    masters: "",
    keycols: "",
    gridcolnum: "",
    gridrowlnum: "",
    m_IDCol: "",
    gridTableName: "",
    beforeCommitObject: ""
  }

  // order
  sosType;
  sosStatus;

  // handle classes
  isWide: boolean = false;

  // routChange 
  routChange: any = {}

  // def rep ID
  defRepID: any = '';

  // items category text description
  itemCatText: string = '';

  constructor(
    private router: ActivatedRoute, 
    private cdRef: ChangeDetectorRef,
    private service: FrmService,
    private binding: DatabindingService,
    private notification: NzNotificationService,
    private route: Router,
    private bnIdle: BnNgIdleService) { }

  ngOnInit() {
    //#region 

    // Session
    // Mohammed Hamouda

    this.bnIdle.startWatching(180).pipe(takeUntil(this.destroyed)).subscribe(
      (isTimedOut: boolean) => {
        if (isTimedOut) {
          //this.logout();
        }
      }
    )

    //#endregion

    //#region 

        // dealing with page language
        // Mohammed Hamouda - 29/12/2020 => v1 (detect language changing)

        this.binding.checkIsLangChanged.subscribe(
          res => {
            if (res != null) {
              this.lang = (res == 'EN') ? lang.en : lang.ar;
            }              
          }
        );

        this.lang = (localStorage.getItem('lang') == 'EN') ? lang.en : lang.ar;

    //#endregion 

    //#region // load system variables
        this.system = JSON.parse(localStorage.getItem('systemVariables'));
    //#endregion

    //#region 
      // get frm type from route 
      // Mohammed Hamouda - 30/12/2020 => v1 
      // Mohammed Hamouda - 4/1/2021 => v2 get object id from route
      // Mohammed Hamouda - 8/1/2021 => v3 handle authorization
      this.subscription = this.router.paramMap.subscribe(
        res => {
          this.routChange = res;
          this.whenRoutChange(this.routChange)
        }
      )
    //#endregion  
  
    //#region 

        // recive data from search component
        // Mohammed Hamouda - 30/12/2020 => v1 (detect when search data send data)

        this.binding.checkSendingDataFromSearch.pipe(takeUntil(this.destroyed)).subscribe(
          res => {
            if (res != null) {
              if (res.length > 0) {                                
                this.isReset = false; // reset isReset so that user can enable it when click on new btn
                this.data = [];
                (res.length == 1) ? this.ifLenghtIsOne(res) : this.ifLengthIsMore(res);
              }                
              else 
                this.arabicOrEnglishMessage(localStorage.getItem('lang'));  
            }
              
          }
        );

    //#endregion 
     
    //#region 

        // responding to task bar
        // Mohammed Hamouda - 31/12/2020 => v1 (detect when task bar did an action)
        // Mohammed Hamouda - 05/01/2021 => v2 (refresh search bar when detect any change && stop calling data)

        this.binding.checkDataReset.subscribe(
          res => {        
            if (res != null) {
              this.isReset = true;
              this.whatMode = "Add";              
            }               
          }
        );

        this.binding.checkDelete.subscribe(
          res => {
            if (res != null && res != false){
              this.isDelete = true;
              this.isReset = false; // reset isReset so that user can enable it when click on new btn
              this.delete();
            }
          }
        )

      this.binding.checkSaveOrUpdate.pipe(takeUntil(this.destroyed)).subscribe(
        res => {
          if (res != null) {
            this.isSaveOrUpdate = true;
            this.isReset = false; // reset isReset so that user can enable it when click on new btn
            this.saveOrUpdate(this.whatMode);
          }            
        }
      ) 
      
      this.binding.checkReport.subscribe(
        res => {
          if (res != null && res != false){
            this.isReporting = true;
            this.getReport();
          }            
        }
      )

    //#endregion
      
    //#region 
        // check if order status changed
        // Mohammed Hamouda

        this.binding.checkOrderStatus.subscribe(
          res => {
            if (res != null) {
              this.sosStatus = res[0];
              this.sosType = res[1];
            }
          }
        )
    //#endregion

  }

  logout() {
    // save required data 
    const savedLang = localStorage.getItem('lang');
    const dictionary = localStorage.getItem('dictionary');

    // vars for displaying notifications
    (this.getLang() == 'EN') ? this.lang = lang.en : this.lang = lang.ar;

    const title = this.lang.sessionMsgTitle;
    const message = this.lang.sessionMsgDetails;
    const options = (this.getLang() == 'EN') ? {nzClass: 'lang-en'} : {nzClass: 'lang-ar'};    

    // clear local storage
    localStorage.clear();

    // add saved data
    localStorage.setItem('lang', savedLang);
    localStorage.setItem('dictionary', dictionary);

    // display notification
    this.notification.warning(title, message, options);

    // direct user to login page
    setTimeout(() => {this.route.navigate(['/authentication/login']);}, 100)    
  }  

  whenRoutChange(res, prevMode = "Add") {
    // reset data 
    this.data = [];
    this.whatMode = prevMode;
    this.userRights = undefined;
    this.objID = undefined;
    this.wordToBeTranslated = undefined;
    // new form info
    this.frmType = res.get('frmType');
    this.objID = res.get('id');
    this.wordToBeTranslated = res.get('frmName');

    localStorage.setItem('frmName', this.frmType);
    localStorage.setItem('objID', this.objID);  
    
    // reset data when load new form      
    this.isRefresh = false;
    
    // check form type
    switch (this.frmType) {
      case 'FrmCostCenters' :
        this.dbTableName = 'CostCenters';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break;
      case 'FrmEntryType' :
        this.dbTableName = 'AccTransTypes';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break;
      case 'FrmBanks' :
        this.dbTableName = 'Banks';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break;
      case 'FrmManufacturers' :
        this.dbTableName = 'Manufacturers';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break;
      case 'FrmItemsGroups' :
        this.dbTableName = 'ItemsGroups';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break; 
      case 'FrmItemsClasses' :
        this.dbTableName = 'ItemsClasses';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break; 
      case 'FrmCustomerCategory' :
        this.dbTableName = 'SalCustomerCategories';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break;
      case 'FrmDeliveryMethods' :
        this.dbTableName = 'SalDeliveryMethods';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break;
      case 'FrmServiceTypes' :
        this.dbTableName = 'ServiceTypes';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break;
      case 'FrmTerms' :
        this.dbTableName = 'Terms';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break;
      case 'FrmPayMethod' :
        this.dbTableName = 'PayMethods';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break;
      case 'FrmEmpCategory' :
        this.dbTableName = 'EmpCategories';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break; 
      case 'FrmOtherCategory' :
        this.dbTableName = 'OtherCategories';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break;
      case 'FrmCountries' :
        this.dbTableName = 'countries';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break;
      case 'FrmCurrencies' :
        this.dbTableName = 'Currencies';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break;
      case 'FrmComPeriods' :
        this.dbTableName = 'ScmPeriods';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break;  
      case 'FrmCostItems' : 
        this.dbTableName = 'CostItems';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break; 
      case 'FrmInvTransTypes' : 
        this.dbTableName = 'InvTransTypes';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break;  
      case 'FrmApproveTransactions' : 
        if (this.objID == 286) {
          this.dbTableName = 'PmtApproveHdr';
        } else if (this.objID == 263) {
          this.dbTableName = 'ExpensesRequestsHdr';
        } else if (this.objID == 290) {
          this.dbTableName = 'ItemRequestHdr';
        } else if (this.objID == 246) {
          this.dbTableName = 'SalQuotationsHdr';
        } else if (this.objID == 245) {
          this.dbTableName = 'SalesOrderHdr';
        } else if (this.objID == 341) {
          this.dbTableName = 'PersonsRequests';
        } else if (this.objID == 342) {
          this.dbTableName = 'PersonsRequests';
        } 

        this.whatMode = '';
        this.isSimpleTransaction = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isApproval = true;
        this.isFullView = false;
        break;  
      case 'FrmOpenTransactions' : 
        if (this.objID == 293) {
          this.dbTableName = 'ItemRequestHdr';
          this.wordToBeTranslated = 'Opened Stock Requests';
        } else if (this.objID == 234) {
          this.dbTableName = 'SalQuotationsHdr';
        } else if (this.objID == 205) {
          this.dbTableName = 'SalesOrderHdr';
        } else if (this.objID == 206) {
          this.dbTableName = 'SalesHdr';
        } else if (this.objID == 213) {
          this.dbTableName = 'SalesHdr';
        } else if (this.objID == 207) {
          this.dbTableName = 'SalesReturnHdr';
        } else if (this.objID == 80) {
          this.dbTableName = 'ServiceOrderHdr';
        } else if (this.objID == 89) {
          this.dbTableName = 'PurchaseHdr';
        } else if (this.objID == 208) {
          this.dbTableName = 'PurchaseOrderHdr';
        } else if (this.objID == 210) {
          this.dbTableName = 'PurchaseHdr';
        } else if (this.objID == 271) {
          this.dbTableName = 'ExpensesRequestsHdr';
        } else if (this.objID == 211) {
          this.dbTableName = 'PurchaseReturnHdr';
        } else if (this.objID == 360) {
          this.dbTableName = 'PurQuotationsHdr';
        }

        this.whatMode = '';
        this.isSimpleTransaction = false;
        this.isApproval = false;
        this.isShowReport = false;
        this.isCancle = true;
        this.isFullView = false;
        break; 
      case 'FrmBrnItemsQty' : 
        this.dbTableName = 'PmtApproveHdr';
        this.whatMode = '';
        this.isSimpleTransaction = false;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = true;
        break; 
      case 'FrmLinkInv' : 
        this.dbTableName = 'PmtApproveHdr';
        this.whatMode = '';
        this.isSimpleTransaction = false;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = true;
        break;  
      case 'FrmItemsExpireList' : 
        this.dbTableName = 'PmtApproveHdr';
        this.whatMode = '';
        this.isSimpleTransaction = false;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = true;
        break;                 
      case 'FrmChangePwd' : 
        this.dbTableName = 'PmtApproveHdr';
        this.whatMode = '';
        this.isSimpleTransaction = false;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = true;
        break; 
      case 'FrmSystem' : 
        this.dbTableName = 'system';
        this.whatMode = '';
        this.isSimpleTransaction = false;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = true;
        break;
      case 'FrmPosting' : 
        this.dbTableName = 'PmtApproveHdr';
        this.whatMode = '';
        this.isSimpleTransaction = false;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = true;
        (this.objID == 22) ? this.isPosting = true : this.isPosting = false;
        break;  
      case 'FrmNotify' : 
        this.dbTableName = 'PmtApproveHdr';
        this.whatMode = '';
        this.isSimpleTransaction = false;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = true;
        break; 
      case 'FrmCustomersRequests' :
        this.dbTableName = 'PersonsRequests';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break;  
      case 'FrmSalesOrders' :
        this.dbTableName = 'SalesOrderHdr';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;              
        break;
      case 'FrmVouchers' :
        this.dbTableName = 'ItemsInOutH';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break; 
      case 'FrmJournal' :
        this.dbTableName = 'AccJournalHdr';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break;  
      case 'FrmCostCenterBudget' :
        this.dbTableName = 'PmtApproveHdr';
        this.whatMode = '';
        this.isSimpleTransaction = false;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = true;
        break;
      case 'FrmBudget' :
        this.dbTableName = 'PmtApproveHdr';
        this.whatMode = '';
        this.isSimpleTransaction = false;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = true;
        break; 
      case 'FrmAccounts' :
        this.dbTableName = 'Accounts';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break; 
      case 'FrmItemsMPG' :
        this.dbTableName = 'ItemsMPGCategory';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break; 
        case 'FrmStores' :
          this.dbTableName = 'Stores';
          this.isSimpleTransaction = true;
          this.isApproval = false;
          this.isCancle = false;
          this.isShowReport = false;
          this.isFullView = false;
          break; 
        case 'FrmItems' :
          this.dbTableName = 'Items';
          this.isSimpleTransaction = true;
          this.isApproval = false;
          this.isCancle = false;
          this.isShowReport = false;
          this.isFullView = false;
          break;
        case 'FrmItemsCat1' :
          this.dbTableName = 'ItemCategory1';
          this.isSimpleTransaction = true;
          this.isApproval = false;
          this.isCancle = false;
          this.isShowReport = false;
          this.isFullView = false;
          break;  
        case 'FrmItemsCat2' :
          this.dbTableName = 'ItemCategory2';
          this.isSimpleTransaction = true;
          this.isApproval = false;
          this.isCancle = false;
          this.isShowReport = false;
          this.isFullView = false;
          break; 
        case 'FrmItemsCat3' :
          this.dbTableName = 'ItemCategory3';
          this.isSimpleTransaction = true;
          this.isApproval = false;
          this.isCancle = false;
          this.isShowReport = false;
          this.isFullView = false;
          break; 
        case 'FrmItemsRequest' :
          this.dbTableName = 'ItemRequestHdr';
          this.isSimpleTransaction = true;
          this.isApproval = false;
          this.isCancle = false;
          this.isShowReport = false;
          this.isFullView = false;
          break;
        case 'FrmPurAck' :
          this.dbTableName = 'PurAcknowledgementsHdr';
          this.isSimpleTransaction = true;
          this.isApproval = false;
          this.isCancle = false;
          this.isShowReport = false;
          this.isFullView = false;
          break;
        case 'FrmPORequest' :
          this.dbTableName = 'PurchaseOrderHdr';
          this.isSimpleTransaction = true;
          this.isApproval = false;
          this.isCancle = false;
          this.isShowReport = false;
          this.isFullView = false;
          break;  
        case 'FrmPurchase' :
          this.dbTableName = 'PurchaseHdr';
          this.isSimpleTransaction = true;
          this.isApproval = false;
          this.isCancle = false;
          this.isShowReport = false;
          this.isFullView = false;
          break; 
        case 'FrmPurchaseReturns' :
          this.dbTableName = 'PurchaseReturnHdr';
          this.isSimpleTransaction = true;
          this.isApproval = false;
          this.isCancle = false;
          this.isShowReport = false;
          this.isFullView = false;
          break;  
        case 'FrmVendorCategory' :
          this.dbTableName = 'PurVendorCategories';
          this.isSimpleTransaction = true;
          this.isApproval = false;
          this.isCancle = false;
          this.isShowReport = false;
          this.isFullView = false;
          break; 
        case 'FrmPersonsGroups' :
          this.dbTableName = 'PersonsGroups';
          this.isSimpleTransaction = true;
          this.isApproval = false;
          this.isCancle = false;
          this.isShowReport = false;
          this.isFullView = false;
          break; 
        case 'FrmPurchaseOrder' :
          this.dbTableName = 'PurchaseOrderHdr';
          this.isSimpleTransaction = true;
          this.isApproval = false;
          this.isCancle = false;
          this.isShowReport = false;
          this.isFullView = false;
          break;  
        case 'FrmPurShipments' :
          this.dbTableName = 'PurShipmentsHdr';
          this.isSimpleTransaction = true;
          this.isApproval = false;
          this.isCancle = false;
          this.isShowReport = false;
          this.isFullView = false;
          break;  
        case 'FrmVendors' :
          this.dbTableName = 'PurShipmentsHdr';
          this.isSimpleTransaction = true;
          this.isApproval = false;
          this.isCancle = false;
          this.isShowReport = false;
          this.isFullView = false;
          break; 
        case 'FrmPurShippers' :
          this.dbTableName = 'PurShippers';
          this.isSimpleTransaction = true;
          this.isApproval = false;
          this.isCancle = false;
          this.isShowReport = false;
          this.isFullView = false;
          break; 
      case 'FrmCostAddOns' : 
        this.dbTableName = 'PmtApproveHdr';
        this.whatMode = '';
        this.isSimpleTransaction = false;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = true;
        break; 
      case 'FrmVendorPriceList' : 
        this.dbTableName = 'PmtApproveHdr';
        this.whatMode = '';
        this.isSimpleTransaction = false;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = true;
        break;  
      case 'FrmBills' :
        this.dbTableName = 'PurchaseHdr';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break; 
      case 'FrmPayables' :
        this.dbTableName = 'PayablesHdr';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break;
      case 'FrmReceivables' :
        this.dbTableName = 'ReceivablesHdr';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break; 
      case 'FrmSales' :
        this.dbTableName = 'SalesHdr';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break; 
      case 'FrmSalQuotations' :
        this.dbTableName = 'SalQuotationsHdr';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break;  
      case 'FrmReserv' :
        this.dbTableName = 'ReservationHdr';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break; 
      case 'FrmPriceList' : 
        this.dbTableName = 'PmtApproveHdr';
        this.whatMode = '';
        this.isSimpleTransaction = false;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = true;
        break;   
      case 'FrmComRatios' :
        this.dbTableName = 'ScmRatiosHdr';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break;
      case 'FrmComSalesmen' :
        this.dbTableName = 'ScmSalesMen';
        this.isSimpleTransaction = true;
        this.isApproval = false;
        this.isCancle = false;
        this.isShowReport = false;
        this.isFullView = false;
        break;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
      default :
        if (this.frmType.includes('.rpt')) {
          this.isSimpleTransaction = false;
          this.isApproval = false;
          this.isShowReport = true;
          this.isCancle = false;
          this.isFullView = false;
        }
        this.dbTableName = 'CostCenters';
        break;                           
    }  

    // user authorization
    this.sql = JSON.parse(localStorage.getItem("SQL")).filter(stm => stm.objName == this.wordToBeTranslated);    
    (this.sql[0].SQL == "") ? this.sqlStm = `SELECT * FROM users` : this.sqlStm = this.sql[0].SQL;           
    this.isAvailableReport = true;  
    this.getSecurity(this.sqlStm, this.dbTableName);

    // table fields
    this.loadTableFieldsName(`SELECT * FROM ${this.dbTableName}`);

    // refrsh shearch bar
    this.reInitSearchBar();
  }

  //#region 
    // load table fields name
    // Mohammed Hamouda - 30/12/2020 - v1
    // Mohammed Hamouda - 12/01/2021 - v2 => load cost items types  

    loadTableFieldsName(SQLStm) {  
      let sql = '';
      let cri = '';

      this.isDbLoading = true;
      this.isLoading = true;

      switch (this.frmType) {
        case 'FrmCostItems':
          sql = 'SELECT DISTINCT CostType FROM CostItems ORDER BY CostType';
          break;
        case 'FrmItemsClasses':
          sql = 'SELECT PersonCode AS VendorCode, PersonName AS VendorName FROM Persons WHERE (Persons.PersonType = 2 AND Persons.Active=1) Order By PersonCode'
          break;
        default :
          sql = '';
          break;
      }      

      this.service.loadTableFieldsName(SQLStm).subscribe(
        res => {   
          this.reInitSearchBar();       
          this.fields = res;
          this.isLoading = false;
        },
        err => {
          this.isLoading = false;
        }
      )

      this.getRequiredDataByOtherForms(sql, cri);
      this.isDbLoading = false;
    }

    getRequiredDataByOtherForms(sql, cri) {
      if (sql != '') {
        this.service.loadData(sql, cri).subscribe(
          res => {
            switch (this.frmType) {
              case 'FrmCostItems':
                this.costItems = res;              
                break;
                case 'FrmItemsClasses':
                  this.vendors = res;              
                 break;              
            }
          }
        )      
      }
    }
  
    //#endregion

  //#region 

    // deal with length of data recived from search component
    // Mohammed Hamouda - 30/12/2020
    // Mohammed Hamouda - 05/01/2021 => v2 (refresh search bar when detect any change && stop calling data)
    // Mohammed Hamouda - 08/01/2021 => v3 (formate date)

    ifLenghtIsOne(data: any) {
      this.data = data;
      this.binding.enableFunctions(true);
      this.whatMode = "Edit";
    }

    ifLengthIsMore(data) {
      for (let i = 0; i <= data.length - 1; i ++) {
        this.data.push(data[i]);
        this.data[i].DateCreated = this.formateDate(this.data[i].DateCreated);
        this.data[i].DateModified = this.formateDate(this.data[i].DateModified);        
        
        (this.data[i].hasOwnProperty('RequestDate')) 
          ? this.data[i].RequestDate = this.formateDate(this.data[i].RequestDate)
          : null;

        (this.data[i].hasOwnProperty('ApprovedDate')) 
          ? this.data[i].ApprovedDate = this.formateDate(this.data[i].ApprovedDate)
          : null ; 
          
        (this.data[i].hasOwnProperty('DeliveryDate')) 
          ? this.data[i].DeliveryDate = this.formateDate(data[i].DeliveryDate)
          : null;

        (this.data[i].hasOwnProperty('OrderDate'))
          ? this.data[i].OrderDate = this.formateDate(data[i].OrderDate)
          : null; 
          
        (this.data[i].hasOwnProperty('TransDate'))
          ? this.data[i].TransDate = this.formateDate(data[i].TransDate)
          : null;            
      }

      this.original = this.data;

      this.isVisible = true;    
    }

    // check when user click a row  

    onItemClicked(index) {
      let filtredData: any[] = [];
      filtredData.push(this.tblData[index])

      this.ifLenghtIsOne(filtredData);

      this.whatMode = "Edit";
      this.isVisible = false;
    }

    
    arabicOrEnglishMessage(lang) {
      let title = 'Search Result';
      let message = 'No Data for your Search';
      let options = {nzClass: 'lang-en'}

      if (lang == 'AR') {
        title = 'نتائج البحث';
        message = 'لا توجد بيانات لعملية البحث';
        options = {nzClass: 'lang-ar'}
      }

      this.notification.warning(title, message, options);
    }

    // v2

    reInitSearchBar() {
      this.isNewLoad = false;
      this.cdRef.detectChanges();
      this.isNewLoad = true;
      this.binding.getAllData(false);
    }

    // v3

    formateDate(date) {
      return new Date(date).toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    //#endregion

    handleCancel(){
      this.isVisible = false;
      this.isRepVisible = false;
      this.data = [];
    }

  //#endregion

  //#region 

    // get security
    // Mohammed Hamouda - 4/1/2021

    getSecurity(sql, dbTableName) {     
      this.service.getSecurity(
        localStorage.getItem('objID'),
        localStorage.getItem('username'),
        localStorage.getItem('branchCode'),
        sql.replace(/\n/g, " "),
        dbTableName,
        this.system[1].SysSalesMan,
        this.system[1].SysPASman,
        this.system[1].SysBillsMan,
        this.system[1].SysJournalsMan,
        this.system[1].SysPayablesMan,
        localStorage.getItem("lang"),).subscribe(
        res => {
          let data: any = res;
          this.isLoading = false;
          this.userRights = data.userRights;
          this.defRepID = data.DefRepID;

          localStorage.setItem("FormRecordSource", data.FormRecordSource);
          localStorage.setItem("HotPrintReports", data.HotPrintReports);

          if (data.HotPrintReports == '') {this.isAvailableReport = false;}

          this.sqlStm = data.FormRecordSource;    
          

          if (this.sqlStm.includes("PERCENT")) {
            this.sqlStm.replace("PERCENT"," ");            
            this.sqlStm = this.sqlStm.replace(/PERCENT/g, " ") 
          } else {                                  
            this.sqlStm.trim();
            if (this.sqlStm.indexOf("SELECT ") != 0) {
              this.sqlStm = `SELECT * FROM ${this.sqlStm}`;
            } else {
              this.sqlStm = this.sqlStm.slice(7)
              this.sqlStm.replace(/TOP 100/g,"");
              this.sqlStm = `SELECT TOP 100  ${this.sqlStm}`;
            }             
          } 

          localStorage.setItem("sqlStm", this.sqlStm);
        }
      )
    }

  //#endregion  

  //#region 

    // check lang

    getLang() {
      return localStorage.getItem('lang');
    }  

  //#endregion

  //#region 

    // delete record
    // Mohammed Hamouda => 08/01/2021

    delete() {
      this.isLoading = true;
      
      const deleteing = setInterval(() => {
        if (typeof(this.dataRecived) != 'undefined') {
          if (isArray(this.dataRecived)) {

            if (this.dataRecived.length == 0) {
              this.binding.showMessage('noChanges');
              this.isDelete = false;
              this.dataRecived = undefined;
              this.isLoading = false;
              clearInterval(deleteing);
              return;
            }  

            this.header = this.dataRecived[0];
            this.dataRecived = this.extractDataAsArray(this.dataRecived[1], true);          

          } else {
            this.dataRecived = this.extractDataAsArray(this.dataRecived);          
          }        

          if (this.frmType == 'FrmManufacturers') {
            this.service.checkIfUsed("ItemsDirectory",  "ManufacturerCode",  `ManufacturerCode='${this.dataRecived[0][1]}'`).subscribe(
              res => {
                if (res > 0) {
                  this.isDelete = false;
                  this.dataRecived = undefined;
                  this.isLoading = false;
                  this.binding.showMessage("canNotDelete");
                } else {this.deleteRecord();}
              }
            )
          } else {
            // this condition set to check the value of system and trans code before deleting
            if (this.dbTableName == 'AccTransTypes') {
              if (this.data[0].TransCode == 'GL' || this.data[0].System == 1) {
                this.binding.showMessage("deleteTransType");
                this.isDelete = false;
                this.dataRecived = undefined;
                this.isLoading = false;
                return;
              }              
            } 

            this.deleteRecord();

          }         
          clearInterval(deleteing);
        }
      }, 100)
            
    }

    deleteRecord() {
      this.service.DeleteRecord(this.dbTableName, this.header.masters, this.header.childs, this.header.gridIndex, this.header.gridrowlnum, this.header.gridcolnum, this.header.gridTableName, this.dataRecived, localStorage.getItem('username'), this.header.beforeCommitObject).subscribe(
        res => {
          this.binding.resetData(true);
          this.binding.showMessage("delete");
          this.binding.enableFunctions(false);          

          this.isDelete = false;
          this.dataRecived = undefined;
          this.isLoading = false;

          this.whatMode = "Add";

          this.header = {
            gridIndex : "",
            childs: "",
            masters: "",
            keycols: "",
            gridcolnum: "",
            gridrowlnum: "",
            m_IDCol: "",
            gridTableName: "",
            beforeCommitObject: ""
          };

          (typeof(this.emailRecived) != 'undefined') && this.mailSetup();                  
        },
        err => {
          let title = 'Delete Result';
          let message = err.error.latin;
          let options = {nzClass: 'lang-en'}
    
          if (localStorage.getItem('lang') == "AR") {
            title = 'نتائج الحذف';
            message = err.error.arabic;
            options = {nzClass: 'lang-ar'}
          }
    
          this.notification.error(title, message, options);

          this.binding.showMessage("stopIcons");

          this.isDelete = false;

          this.isLoading = false;

          this.header = {
            gridIndex : "",
            childs: "",
            masters: "",
            keycols: "",
            gridcolnum: "",
            gridrowlnum: "",
            m_IDCol: "",
            gridTableName: "",
            beforeCommitObject: ""
          }
        }
      )
    }

  //#endregion

  //#region 

    // handle save or update
    // Mohammed Hamouda - 4/1/2021

    saveOrUpdate(type) {
      this.isLoading = true;
      this.isRefresh = false;

      const saveingOrUpdating = setInterval(() => {
        if (typeof(this.dataRecived) != 'undefined') { 
          if (isArray(this.dataRecived)) {

            if (this.dataRecived.length == 0) {
              this.binding.showMessage('noChanges');
              this.isSaveOrUpdate = false;
              this.dataRecived = undefined;
              this.isLoading = false;
              clearInterval(saveingOrUpdating);
              return;
            }

            this.header = this.dataRecived[0];

            if (this.header.gridrowlnum == 0) {
              this.binding.showMessage('noGrid');

              this.isSaveOrUpdate = false;
              this.dataRecived = undefined;
              this.isLoading = false;
              clearInterval(saveingOrUpdating);
              return;
            }

            this.dataRecived = this.extractDataAsArray(this.dataRecived[1], true);
          } else {
            this.dataRecived = this.extractDataAsArray(this.dataRecived);
            this.dataRecived.push(["IssuedBy", localStorage.getItem('username')]);
            this.dataRecived.push(["DateCreate", ""]);
            this.dataRecived.push(["DateModified", ""]);  
          }         

          if (type == "Add" && this.dbTableName == 'AccTransTypes') {
            this.dataRecived.push(["System", 0]);
          }

          this.callBackEndToSaveOrUpdate(this.dataRecived, type);
          clearInterval(saveingOrUpdating);
        }
      },100);      
    }

      // call backend to save or update

      callBackEndToSaveOrUpdate(data, type) {
        this.service.saveRecord(data, this.dbTableName, type, localStorage.getItem("username"), this.header.gridIndex, this.header.childs, this.header.masters, this.header.keycols, this.header.gridcolnum, this.header.gridrowlnum, this.header.m_IDCol, this.header.gridTableName, this.header.beforeCommitObject).subscribe(
          res => {
            (type == "Edit") ? this.binding.showMessage("edit2") : this.binding.showMessage("add");
            (type == "Add") ? this.binding.resetData(true) : null;

            this.isSaveOrUpdate = false;
            this.dataRecived = undefined;
            this.isLoading = false;
            this.isRefresh = true;

            this.header = {
              gridIndex : "",
              childs: "",
              masters: "",
              keycols: "",
              gridcolnum: "",
              gridrowlnum: "",
              m_IDCol: "",
              gridTableName: "",
              beforeCommitObject: ""
            };
            
            (type == "Edit" && typeof(this.emailRecived) != 'undefined') && this.mailSetup(); 
            
          },
          err => {
            let title = 'Somthing Wrong';
            let message = err.error.latin;
            let options = {nzClass: 'lang-en'}
      
            if (localStorage.getItem('lang') == "AR") {
              title = 'حدث خطأ';
              message = err.error.arabic;
              options = {nzClass: 'lang-ar'}
            }

            this.isSaveOrUpdate = false;
            this.dataRecived = undefined;
            this.isLoading = false;             
      
            this.notification.warning(title, message, options);
  
            this.binding.showMessage("stopIcons");

            this.header = {
              gridIndex : "",
              childs: "",
              masters: "",
              keycols: "",
              gridcolnum: "",
              gridrowlnum: "",
              m_IDCol: "",
              gridTableName: "",
              beforeCommitObject: ""
            }
          }
        )
      }

      // send mail

      mailSetup() {
        let event;
        let mailType;
  
        (this.objID == 339 || this.objID == 340) ? mailType = 'customer' : mailType = 'other';
        
        switch(this.objID) {
          case '339':
            event = 24;
            break;
          case '340':
            event = 25;
            break; 
          default  :
            event = this.emailRecived[1]
            break;                                  
        }

  
        this.sendMail(event, mailType)
      }

      sendMail(event, type) {
        let options = (localStorage.getItem('lang') == 'EN') ? {nzClass: 'lang-en'} : {nzClass: 'lang-ar'};
        let system = JSON.parse(localStorage.getItem('systemVariables'));

        const email = setInterval (() => {
          if (typeof(this.emailRecived) != 'undefined') {
            if (type == 'customer') {
              this.service.customersRequestsNotify(
                this.emailRecived, 
                system[1].Glb_Branch_Name, 
                localStorage.getItem('username'), 
                event).subscribe(
                res => {
                  this.notification.success(`${this.lang.genericMailMsgTitle}`, `${this.lang.genericMailMsgDetails}`, options);
                  this.emailRecived = undefined;
                },
                err => {
                  this.notification.warning(`${this.lang.genericMailMsgTitle}`, `${this.lang.genericMailMsgErrDetails}`, options);
                  this.emailRecived = undefined;
                }
              )
            } else {
              let event = this.emailRecived[0];
              let mail = this.emailRecived[1];

              this.service.Notify(event, mail, system[1].Glb_Branch_Name, localStorage.getItem('username')).subscribe(
                res => {
                  this.notification.success(`${this.lang.genericMailMsgTitle}`, `${this.lang.genericMailMsgDetails}`, options);
                  this.emailRecived = undefined;
                },
                err => {
                  this.notification.warning(`${this.lang.genericMailMsgTitle}`, `${this.lang.genericMailMsgErrDetails}`, options);
                  this.emailRecived = undefined;
                }
              )
            }
            clearInterval(email);
          }
        }, 100) 
      }

  //#endregion

  //#region 

    // get report
    // Mohammed Hamouda - 4/1/2021

    getReport() {      
      const lines = localStorage.getItem('HotPrintReports').split(";");
      
      const reporting = setInterval(() => {
        if (typeof(this.dataRecived) != 'undefined') { 

          this.repObj = lines.map((val, index) => {
            return {
              RepID: lines[index].split(',')[0],
              RepTitle: lines[index].split(',')[1],
              RepCri: `${lines[index].split(',')[3]}^^^=^^^${this.dataRecived}^^^${null}^^^AND`
            }
          });

          this.isRepVisible = true;
          this.binding.getReport(false);
          this.dataRecived = undefined;
          this.isReporting = false;

          clearInterval(reporting);
        }
      },100);      
    }

    // highlight report report
    // select report to be printed
    // Mohammed Hamouda - 4/1/2021

    addHighLight(index) {
      // highlight selected rep
      $('body').on("click", '.rep-name', function() {
        $(this).addClass('highlight').siblings().removeClass('highlight')
      });
      
      // selected report
      this.selectedRep = this.repObj[index];
    }

    runRep(type) {
      this.isDisplayRep = true;
      this.runOrPrintRip(type)
    }

    printRep(type){
      this.isPrintRip = true;
      this.runOrPrintRip(type)
    }

    runOrPrintRip(type) {
      (typeof(this.selectedRep) == 'undefined') ? this.selectedRep = this.repObj[0] : null;
      this.service.downloadReport(
        type, 
        this.selectedRep.RepID, 
        localStorage.getItem('username'),
        this.selectedRep.RepCri , 
        this.selectedRep.RepTitle,
        localStorage.getItem("lang"),
        localStorage.getItem("companyName"),
        localStorage.getItem("branchName")).subscribe(
        res => {
          let url = window.URL.createObjectURL(res);
          if (type == 0) {            
            window.open(url);
            this.isDisplayRep = false;
          } else {
            const repPrint = window.open(url);
            repPrint.print();
            this.isPrintRip = false;
          }

          this.isRepVisible = false;
          this.dataRecived = undefined;

          this.isRepVisible = false;

          this.selectedRep = undefined;
        }
      )
    }

  //#endregion

  //#region 

    // this function is used to recive data from child component
    // Mohammed Hamouda => 08/01/2021
    reciveDataHandler(data) {
      this.dataRecived = data;
    }

    // this function is used to recive ID from child component
    reciveIdHandler(data){
      this.dataRecived = data;
    }

    // this function is used to recive data from table pagination
    tblPageChangeHandler(data){
      this.tblData = data;
    }

    // this function is used to recive email from child component
    reciveEmailHandler(data) {
      let event;
      let type;

      this.emailRecived = data;

      /*(this.objID == 339 || this.objID == 340) ? type = 'customer' : type = 'other';
      
      switch(this.objID) {
        case '339':
          event = 24;
          break;
        case '340':
          event = 25;
          break; 
        default  :
          event = this.emailRecived[1]
          break;                                  
      }

      this.sendMail(event, 'other')*/
    } 

    // this function is used to recive item cat description child component
    reciveCatTextHandler(val) {this.itemCatText = val}

  //#endregion

  //#region 

  // generic cpllection data
  // Mohammed Hamouda - 13/01/2021
  extractDataAsArray(data, isArr = false) {
    let arrOfKeys = Object.keys(data);
    let arrOfData = [];

    if (isArr) {
      let arr = data;
      for (let i = 0; i <= arr.length - 1; i++) {
        let data = arr[i];
        arrOfKeys = Object.keys(data);
  
        for (let k = 0; k <= arrOfKeys.length - 1; k ++) {
          arrOfData.push([arrOfKeys[k], (data[arrOfKeys[k]] == null ? "" : data[arrOfKeys[k]])])
        }
      }

    } else {
      for (let i = 0; i <= arrOfKeys.length - 1; i ++) {
        arrOfData.push([arrOfKeys[i], (data[arrOfKeys[i]] == null ? "" : data[arrOfKeys[i]])])
        if(arrOfKeys[i] == "CenterIsFinal") {
          arrOfData[i] = [arrOfKeys[i], (data[arrOfKeys[i]] == true ? 1 : 0)]
        }
      }
    }


    return arrOfData;
  }

  extractDataFromArray(arr: any[]) {
    let arrOfKeys;
    let arrOfData = [];

    for (let i = 0; i <= arr.length - 1; i++) {
      let data = arr[i];
      arrOfKeys = Object.keys(data);

      for (let k = 0; k <= arrOfKeys.length - 1; k ++) {
        arrOfData.push([arrOfKeys[k], (data[arrOfKeys[k]] == null ? "" : data[arrOfKeys[k]])])
      }
    }

    return arrOfData;
  }
  //#endregion

  //#region 

  // table search with reset function
  // Mohammed Hamouda - 13/01/2021

  filterData(searchKey, val) {
    
    let innerQuery = this.sqlStm;
    let query = `Select Top 100 * From (${innerQuery}) as tblResult Where tblResult.${searchKey} like '**${val}**'`;
    let top100Index = this.sqlStm.toUpperCase().indexOf('TOP 100');
    
    // remove top 100 from inner query
    if (top100Index != -1) {
      innerQuery = innerQuery.replace('TOP 100' , '');
      query = `Select Top 100 * From (${innerQuery}) as tblResult Where tblResult.${searchKey} like '**${val}**'`    
    }

    // remove order by from inner query
    let orderByindex = innerQuery.toUpperCase().indexOf('ORDER BY');

    if (orderByindex != -1) {
      innerQuery = innerQuery.substring(0, orderByindex)
      query = `Select Top 100 * From (${innerQuery}) as tblResult Where tblResult.${searchKey} like '**${val}**'`
    }

    this.original = this.data;
    this.isTableSearch = true;

    this.service.searchDv(query).subscribe(
      res => {
        let data: any = res

        for (let i = 0; i <= data.length - 1; i ++) {
          data[i].DateCreated = this.formateDate(data[i].DateCreated);
          data[i].DateModified = this.formateDate(data[i].DateModified);
        }        

        if(data.length > 0) {
          this.data = data;

        } else {
          this.data = [];
        }
        this.isTableSearch = false;
      }
    )
  }

  reset() {
    this.data = this.original;
    this.original = [];
    this.binding.resetData(true);
  }

  //#endregion

  //#region 

  // sort
  // Mohammed Hamouda - 14/03/2021

  sotrHandler(event) {
    this.data = event;
  }

  //#endregion

  //#region 

    // handle close modals using esc btn
    // Mohammed Hamouda 13/01/2021

    @HostListener('window:keyup', ['$event'])
    onEsc(event) {
      if (event.keyCode == 27) {
        this.isVisible = false;
        this.isRepVisible = false;
      }
    }

    @HostListener('window:focus', ['$event'])
    onFocus(event: FocusEvent): void {
      let prevMode = this.whatMode;        
      this.subscription = this.router.paramMap.subscribe(
        res => {
          this.routChange = res;
          this.whenRoutChange(this.routChange, prevMode)
        }
      )      
    } 
    
    @HostListener('window:blur', ['$event'])
    onBlur(event: FocusEvent): void {
      this.isVisible = false;
      this.isRepVisible = false;      
    }    

  //#endregion

  ngOnDestroy() {
    //#region 
      // cancel subscription
      // Mohammed Hamouda - 30/12/2020
      this.subscription.unsubscribe();
    //#endregion
  }

}
