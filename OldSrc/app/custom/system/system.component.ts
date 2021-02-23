import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { DatabindingService } from 'src/services/databinding.service';
import { FrmService } from 'src/services/frm/frm.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as $ from 'jquery';
import * as lang from './../../../settings/lang';
import { takeUntil } from 'rxjs/operators';

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

  // search var
  fields: any = [];
  isDbLoading = true;

  // child var
  data = [];
  isReset = false;
  isDelete = false;
  isSaveOrUpdate = false;
  isReporting = false;
  dataRecived;

  // loading var
  isLoading = true;
  isNewLoad = true;

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
  selectedRep;

  // modals variables
  isVisible;

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

  constructor(
    private router: ActivatedRoute, 
    private cdRef: ChangeDetectorRef,
    private service: FrmService,
    private binding: DatabindingService,
    private notification: NzNotificationService,) { }

  ngOnInit() {

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

    //#region 
      // get frm type from route 
      // Mohammed Hamouda - 30/12/2020 => v1 
      // Mohammed Hamouda - 4/1/2021 => v2 get object id from route
      // Mohammed Hamouda - 8/1/2021 => v3 handle authorization
      this.subscription = this.router.paramMap.subscribe(
        res => {
          // reset data 
          this.data = [];
          this.whatMode = "Add";

          // new form info
          this.frmType = res.get('frmType');
          this.objID = res.get('id');

          localStorage.setItem('frmName', this.frmType);
          localStorage.setItem('objID', this.objID);  
          
          // reset data when load new form
          /*this.binding.resetData(true); 
          this.destroyed.next(true);
          this.destroyed.unsubscribe();*/        

          // check form type
          switch (this.frmType) {
            case 'FrmCostCenters' :
              this.dbTableName = 'CostCenters';
              this.wordToBeTranslated = 'CostCenters';
              break;
            case 'FrmEntryType' :
              this.dbTableName = 'AccTransTypes';
              this.wordToBeTranslated = 'Entry Types'
              break;
            case 'FrmBanks' :
              this.dbTableName = 'Banks';
              this.wordToBeTranslated = 'Banks'
              break;
            case 'FrmManufacturers' :
              this.dbTableName = 'Manufacturers';
              this.wordToBeTranslated = 'Manufacturers'
              break;
            case 'FrmItemsGroups' :
              this.dbTableName = 'ItemsGroups';
              this.wordToBeTranslated = 'Items Groups'
              break; 
            case 'FrmItemsClasses' :
              this.dbTableName = 'ItemsClasses';
              this.wordToBeTranslated = 'Items Classes'
              break; 
            case 'FrmCustomerCategory' :
              this.dbTableName = 'SalCustomerCategories';
              this.wordToBeTranslated = 'Customer Categories'
              break;
            case 'FrmDeliveryMethods' :
              this.dbTableName = 'SalDeliveryMethods';
              this.wordToBeTranslated = 'Sales Delivery Methods'
              break;
            case 'FrmServiceTypes' :
              this.dbTableName = 'ServiceTypes';
              this.wordToBeTranslated = 'Service Types'
              break;
            case 'FrmTerms' :
              this.dbTableName = 'Terms';
              this.wordToBeTranslated = 'Payment Terms'
              break;
            case 'FrmPayMethod' :
              this.dbTableName = 'PayMethods';
              this.wordToBeTranslated = 'Payment Method'
              break;
            case 'FrmEmpCategory' :
              this.dbTableName = 'EmpCategories';
              this.wordToBeTranslated = 'Employees Categories'
              break; 
            case 'FrmOtherCategory' :
              this.dbTableName = 'OtherCategories';
              this.wordToBeTranslated = 'Others Categories'
              break;
            case 'FrmCountries' :
              this.dbTableName = 'countries';
              this.wordToBeTranslated = 'Countries'
              break;
            case 'FrmCurrencies' :
              this.dbTableName = 'Currencies';
              this.wordToBeTranslated = 'Currencies'
              break;
            case 'FrmComPeriods' :
              this.dbTableName = 'ScmPeriods';
              this.wordToBeTranslated = 'Commission Periods'
              break;  
            case 'FrmCostItems' : 
              this.dbTableName = 'CostItems';
              this.wordToBeTranslated = 'Costing Items';
              break;                                                                                                                                                                                                                                
            default :
              this.dbTableName = 'CostCenters';
              break;                           
          }  

          // user authorization
          this.sql = JSON.parse(localStorage.getItem("SQL")).filter(stm => stm.objName == this.frmType);
          this.sqlStm = this.sql[0].SQL; 
          this.isAvailableReport = true;  
          this.getSecurity(this.sqlStm, this.dbTableName);

          // table fields
          this.loadTableFieldsName(`SELECT * FROM ${this.dbTableName}`);

          // refrsh shearch bar
          this.reInitSearchBar();

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
                this.binding.enableFunctions(true);
                this.isReset = false; // reset isReset so that user can enable it when click on new btn
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
       
  }

  //#region 
    // load table fields name
    // Mohammed Hamouda - 30/12/2020 - v1
    // Mohammed Hamouda - 12/01/2021 - v2 => load cost items types  

    loadTableFieldsName(SQLStm) {  
      let sql = '';
      let cri = '';

      this.isDbLoading = true;

      this.service.loadTableFieldsName(SQLStm).subscribe(
        res => {   
          this.reInitSearchBar();       
          this.fields = res;
          switch (this.frmType) {
            case 'FrmCostItems':
              sql = 'SELECT DISTINCT CostType FROM CostItems ORDER BY CostType';
              break;
            case 'FrmItemsClasses':
              sql = 'SELECT PersonCode AS VendorCode, PersonName AS VendorName FROM Persons WHERE (Persons.PersonType = 2 AND Persons.Active=1) Order By PersonCode'
          }
          this.getRequiredDataByOtherForms(sql, cri);
          this.isDbLoading = false; 
          console.log(res)
        },
        err => {
          console.log(err)
        }
      )
    }

    getRequiredDataByOtherForms(sql, cri) {
      this.service.loadData(sql, cri).subscribe(
        res => {
          switch (this.frmType) {
            case 'FrmCostItems':
              console.log(res)
              this.costItems = res;              
              break;
              case 'FrmItemsClasses':
                this.vendors = res; 
                console.log(res)             
               break;              
          }
        }
      )
    }
  
    //#endregion

  //#region 

    // deal with length of data recived from search component
    // Mohammed Hamouda - 30/12/2020
    // Mohammed Hamouda - 05/01/2021 => v2 (refresh search bar when detect any change && stop calling data)
    // Mohammed Hamouda - 08/01/2021 => v3 (formate obj according to type)

    ifLenghtIsOne(data: any) {
      this.data = data;
      this.whatMode = "Edit";
    }

    ifLengthIsMore(data) {
      switch(this.frmType) {
        case 'FrmCostCenters' :
          this.costCenterObj(data);
          break;
        case 'FrmEntryType' :
          this.tCodeObj(data);
          break; 
          case 'FrmBanks' :
            this.banksObj(data);
            break;
          case 'FrmManufacturers' :
            this.manufacturerssObj(data);
            break;  
          case 'FrmItemsGroups' :
            this.itemsGroupsObj(data);
            break;
          case 'FrmItemsClasses' :
            this.itemsClassesObj(data);
            break; 
          case 'FrmCustomerCategory' :
            this.customerCategoryObj(data);
            break; 
          case 'FrmDeliveryMethods' :
            this.deliveryMethodsObj(data);
            break;
          case 'FrmServiceTypes' :
            this.serviceTypesObj(data);
            break; 
          case 'FrmTerms' :
            this.termsObj(data);
            break;
          case 'FrmPayMethod' :
            this.payMethodObj(data);
            break; 
          case 'FrmEmpCategory' :
            this.empCategoryObj(data);
            break;
          case 'FrmOtherCategory' :
            this.otherCategoryObj(data);
            break; 
          case 'FrmCountries' :
            this.countriesObj(data);
            break;  
          case 'FrmCurrencies' :
            this.currenciesObj(data);
            break; 
          case 'FrmComPeriods' : 
            this.commissionPariodObj(data);
            break; 
          case 'FrmCostItems' : 
            this.costItemObj(data);
            break;                                                                                                                                                                                              
      }

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

    //#region // GL objects
    costCenterObj(data) {
      this.data = data.map((val) => {
        return {
          CenterCode: val.CenterCode,
          CenterName: val.CenterName,
          IssuedBy: val.IssuedBy,
          CenterParent: val.CenterParent,
          ParentName: val.ParentName,
          CenterLevel: val.CenterLevel,
          NumberOfChildren: val.NumberOfChildren,
          CenterIsFinal: val.CenterIsFinal,
          DateCreated: `${new Date(val.DateCreated).toLocaleString("en-US", {timeZone: "America/New_York"})}`,
          DateModified: `${new Date(val.DateModified).toLocaleString("en-US", {timeZone: "America/New_York"})}`,
        }
      });      
    }

    tCodeObj(data) {
      this.data = data.map((val) => {
        return {
          TransCode: val.TransCode,
          TransName: val.TransName,
          System: val.System,
          IssuedBy: val.IssuedBy,
          Notes: val.Notes,
          DateCreated: `${new Date(val.DateCreated).toLocaleString("en-US", {timeZone: "America/New_York"})}`,
          DateModified: `${new Date(val.DateModified).toLocaleString("en-US", {timeZone: "America/New_York"})}`,
        }
      });
    }

    //#endregion
    
    //#region // Saves & Banks objects
    banksObj(data) {
      this.data = data.map((val) => {
        return {
          BankNum: val.BankNum,
          BankName: val.BankName,
          OurBankAccount: val.OurBankAccount,
          BankAddress: val.BankAddress,
          Notes: val.Notes,
          DateCreated: `${this.formateDate(val.DateCreate)}`,
          DateModified: `${this.formateDate(val.DateModified)}`,
          IssuedBy: val.IssuedBy
        }
      });      
    }
    //#endregion
    
    //#region  // Inventory objects
    manufacturerssObj(data) {
      this.data = data.map((val) => {
        return {
          ManufacturerCode: val.ManufacturerCode,
          Manufacturer: val.Manufacturer,
          Notes: val.Notes,
          DateCreated: `${this.formateDate(val.DateCreate)}`,
          DateModified: `${this.formateDate(val.DateModified)}`,
          IssuedBy: val.IssuedBy
        }
      });      
    }

    costItemObj(data) {
      this.data = data.map((val) => {
        return {
          CostCode: val.CostCode,
          CostName: val.CostName,
          AffectPrice: val.AffectPrice,
          CostType: val.CostType,
          Notes: val.Notes,
          DateCreated: `${this.formateDate(val.DateCreate)}`,
          DateModified: `${this.formateDate(val.DateModified)}`,
          IssuedBy: val.IssuedBy
        }
      }); 
    }

    itemsGroupsObj(data) {
      this.data = data.map((val) => {
        return {
          GroupID: val.GroupID,
          ItemGroup: val.ItemGroup,
          Notes: val.Notes,
          DateCreated: `${this.formateDate(val.DateCreate)}`,
          DateModified: `${this.formateDate(val.DateModified)}`,
          IssuedBy: val.IssuedBy
        }
      }); 
    }

    itemsClassesObj(data) {
      this.data = data.map((val) => {
        return {
          GroupID: val.GroupID,
          ItemGroup: val.ItemGroup,
          Notes: val.Notes,
          DateCreated: `${this.formateDate(val.DateCreate)}`,
          DateModified: `${this.formateDate(val.DateModified)}`,
          IssuedBy: val.IssuedBy
        }
      }); 
    }
    
    //#endregion

    //#region // Sales objects

    customerCategoryObj(data){
      this.data = data.map((val) => {
        return {
          CategoryCode: val.CategoryCode,
          Description: val.Description,
          DiscountRatio: val.DiscountRatio,
          Notes: val.Notes,          
          DateCreated: `${this.formateDate(val.DateCreate)}`,
          DateModified: `${this.formateDate(val.DateModified)}`,
          IssuedBy: val.IssuedBy
        }
      });
    }

    deliveryMethodsObj(data){
      this.data = data.map((val) => {
        return {
          DeliveryMethodCode: val.DeliveryMethodCode,
          DeliveryMethod: val.DeliveryMethod,
          Notes: val.Notes,          
          DateCreated: `${this.formateDate(val.DateCreate)}`,
          DateModified: `${this.formateDate(val.DateModified)}`,
          IssuedBy: val.IssuedBy
        }
      });
    }

    commissionPariodObj(data){
      this.data = data.map((val) => {
        return {
          PeriodCode: val.PeriodCode,
          PeriodDescription: val.PeriodDescription,
          StartDate: `${this.formateDate(val.StartDate)}`,
          EndDate: `${this.formateDate(val.EndDate)}`,
          Notes: val.Notes,          
          DateCreated: `${this.formateDate(val.DateCreate)}`,
          DateModified: `${this.formateDate(val.DateModified)}`,
          IssuedBy: val.IssuedBy
        }
      });
    }    

    //#endregion

    //#region  // Service objects

    serviceTypesObj(data) {
      this.data = data.map((val) => {
        return {
          ServiceTypeCode: val.ServiceTypeCode,
          ServiceType: val.ServiceType,
          Notes: val.Notes,          
          DateCreated: `${this.formateDate(val.DateCreate)}`,
          DateModified: `${this.formateDate(val.DateModified)}`,
          IssuedBy: val.IssuedBy
        }
      });
    }

    //#endregion

    //#region // Basic data objects

    termsObj(data) {
      this.data = data.map((val) => {
        return {
          Terms: val.Terms,
          CreditFor: val.CreditFor,
          Prepayment: val.Prepayment,
          CashOnDelivery: val.CashOnDelivery,
          Notes: val.Notes,          
          DateCreated: `${this.formateDate(val.DateCreate)}`,
          DateModified: `${this.formateDate(val.DateModified)}`,
          IssuedBy: val.IssuedBy,
          CreditForComm: val.CreditForComm
        }
      });
    }

    payMethodObj(data) {
      this.data = data.map((val) => {
        return {
          PayMethod: val.PayMethod,
          Method: val.Method,
          Notes: val.Notes,          
          DateCreated: `${this.formateDate(val.DateCreate)}`,
          DateModified: `${this.formateDate(val.DateModified)}`,
          IssuedBy: val.IssuedBy,
        }
      });
    }

    empCategoryObj(data) {
      this.data = data.map((val) => {
        return {
          CategoryCode: val.CategoryCode,
          Description: val.Description,
          Notes: val.Notes,          
          DateCreated: `${this.formateDate(val.DateCreate)}`,
          DateModified: `${this.formateDate(val.DateModified)}`,
          IssuedBy: val.IssuedBy,
        }
      });
    }

    otherCategoryObj(data){
      this.data = data.map((val) => {
        return {
          CategoryCode: val.CategoryCode,
          Description: val.Description,
          Notes: val.Notes,          
          DateCreated: `${this.formateDate(val.DateCreate)}`,
          DateModified: `${this.formateDate(val.DateModified)}`,
          IssuedBy: val.IssuedBy,
        }
      });
    }

    countriesObj(data) {
      this.data = data.map((val) => {
        return {
          CountryCode: val.CountryCode,
          CountryName: val.CountryName,
          Notes: val.Notes,          
          DateCreated: `${this.formateDate(val.DateCreate)}`,
          DateModified: `${this.formateDate(val.DateModified)}`,
          IssuedBy: val.IssuedBy,
        }
      });
    }

    currenciesObj(data) {
      this.data = data.map((val) => {
        return {
          CurrencyCode: val.CurrencyCode,
          CurrencyName: val.CurrencyName,
          ChangeRate: val.ChangeRate,
          Notes: val.Notes,          
          DateCreated: `${this.formateDate(val.DateCreate)}`,
          DateModified: `${this.formateDate(val.DateModified)}`,
          IssuedBy: val.IssuedBy,
        }
      });
    }

    //#endregion

    //#region // formate date

    formateDate(date) {
      return new Date(date).toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    //#endregion

    handleCancel(){
      this.isVisible = false;
      this.isRepVisible = false;
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
        this.sqlStm,
        dbTableName,
        localStorage.getItem('username'),
        localStorage.getItem('username'),
        localStorage.getItem('username'),
        localStorage.getItem('username'),
        localStorage.getItem("lang"),).subscribe(
        res => {
          let data: any = res;
          this.isLoading = false;
          this.userRights = data.userRights;
          
          localStorage.setItem("FormRecordSource", data.FormRecordSource);
          localStorage.setItem("HotPrintReports", data.HotPrintReports);

          if (data.HotPrintReports == '') {this.isAvailableReport = false;}

          this.sqlStm = data.FormRecordSource;

          if (this.sqlStm.includes(" PERCENT ")) {
            this.sqlStm.replace(" PERCENT "," ");
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
      
      const deleteing = setInterval(() => {
        if (typeof(this.dataRecived) != 'undefined') {
          // this condition set to check the value of system and trans code before deleting
          if (this.dbTableName == 'AccTransTypes') {
            if (this.data[0].TransCode == 'GL' || this.data[0].System == 1) {
              this.binding.showMessage("deleteTransType");
              this.isDelete = false;
              this.dataRecived = undefined;
            }              
            else
              this.deleteRecord();
          } else {
            this.deleteRecord();
          }          
          clearInterval(deleteing);
        }
      }, 100)
            
    }

    deleteRecord() {
      this.service.DeleteRecord(this.dbTableName, "", "", "", "", "", "", this.dataRecived).subscribe(
        res => {
          this.binding.resetData(true);
          this.binding.showMessage("delete");
          this.binding.enableFunctions(false);          

          this.isDelete = false;
          this.dataRecived = undefined;

          this.whatMode = "Add";
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
        }
      )
    }

  //#endregion

  //#region 

    // handle save or update
    // Mohammed Hamouda - 4/1/2021

    saveOrUpdate(type) {

      const saveingOrUpdating = setInterval(() => {
        if (typeof(this.dataRecived) != 'undefined') {   

          this.dataRecived.push(["IssuedBy", localStorage.getItem('username')]);
          this.dataRecived.push(["DateCreate", ""]);
          this.dataRecived.push(["DateModified", ""]);

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
        this.service.saveRecord(data, this.dbTableName, type, localStorage.getItem("username"), "", "", "", "", "", "", "", "", "").subscribe(
          res => {
            (type == "Edit") ? this.binding.showMessage("edit2") : this.binding.showMessage("add");
            (type == "Add") ? this.binding.resetData(true) : null;
            console.log(res)
            this.isSaveOrUpdate = false;
            this.dataRecived = undefined;
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
      
            this.notification.warning(title, message, options);
  
            this.binding.showMessage("stopIcons");

            this.isSaveOrUpdate = false;
            this.dataRecived = undefined;
          }
        )
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
      this.service.downloadReport(
        type, 
        this.selectedRep.RepID, 
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

  //#endregion

  ngOnDestroy() {
    //#region 
      // cancel subscription
      // Mohammed Hamouda - 30/12/2020
      this.subscription.unsubscribe();
    //#endregion
  }

}
