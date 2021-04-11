import { EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FrmService } from 'src/services/frm/frm.service';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css']
})
export class BillsComponent implements OnInit, OnChanges {
  // extchange data between parent and child
  @Input('data') data = [];
  @Input('isReset') isReset = false;
  @Input('isDelete') isDelete = false;
  @Input('isSaveOrUpdate') isSaveOrUpdate = false;
  @Input('isRefresh') isRefresh = false;
  @Input('isReporting') isReporting = false;
  @Output('returnData') returnData : EventEmitter<any> = new EventEmitter();
  @Output('returnID') returnID : EventEmitter<any> = new EventEmitter();
  @Output('returnEmail') returnEmail: EventEmitter<any> = new EventEmitter();

  // dtat to be sent to chiled component
  dataSentToForms: any = [];
  vendorsData: any = [];
  costCentersData: any = [];
  buyerData: any = [];
  termsData: any = [];
  gridData: any = [];
  accData: any = [];

  // current form values
  currentFormVal: any = {};
  currentContactVal: any = {};

  // loader
  isLoading: boolean = true;

  // language
  lang: any; 
  
  // sql statments
  queries: any[] = [
    `SELECT Persons.PersonCode, Persons.PersonName, Persons.CurrencyCode, Currencies.CurrencyName, Currencies.ChangeRate, Persons.CategoryCode, Persons.CenterCode, CostCenters.CenterName FROM Persons INNER JOIN Currencies ON Persons.CurrencyCode = Currencies.CurrencyCode LEFT OUTER JOIN CostCenters ON Persons.CenterCode = CostCenters.CenterCode WHERE(Persons.PersonType = 2 AND BranchCode= '${localStorage.getItem('branchCode')}' AND Persons.Active=1) Order By PersonCode`,
    `Select CenterName, CenterCode From CostCenters`, // cost centers
    `SELECT PersonCode, PersonName FROM Persons WHERE (PersonType=3 AND Persons.Active=1 AND BranchCode= '${localStorage.getItem('branchCode')}' ) Order By PersonCode`, // buyers
    `SELECT Terms From Terms Order By Terms`, // terms
    `SELECT PurchaseAccDtl.AccID, Accounts.AccName, PurchaseAccDtl.Value, PurchaseAccDtl.PersonCode, Persons.PersonName, SUM( PurchaseCC.ValueCurr) AS CostCenters, PurchaseAccDtl.Memo, PurchaseAccDtl.ID FROM PurchaseAccDtl INNER JOIN Accounts ON PurchaseAccDtl.AccID = Accounts.AccCode LEFT OUTER JOIN PurchaseCC ON PurchaseAccDtl.ID = PurchaseCC.ID LEFT OUTER JOIN Persons ON PurchaseAccDtl.PersonCode = Persons.PersonCode GROUP BY PurchaseAccDtl.Value, PurchaseAccDtl.AccID, Accounts.AccName, PurchaseAccDtl.PersonCode, Persons.PersonName, PurchaseAccDtl.Memo, PurchaseAccDtl.ID ORDER BY PurchaseAccDtl.AccID`, // query
    `SELECT AccCode, AccName, SubAccType FROM Accounts INNER JOIN AccTypes ON Accounts.TypeCode = AccTypes.TypeCode WHERE IsFinal=1`
  ];  

  // check add or update
  isNewRecord: boolean = false;  

  // active
  isActiveGrid: boolean = false;

  // grid data
  gridReviced: any = [];

  constructor(private service: FrmService) { }

  ngOnInit() {
    this.getAllData();
  }

  //#region 

    // check lang

    getLang() {
      return localStorage.getItem('lang');
    }  

  //#endregion
  
  //#region     

    getAllData() { // get all data
      this.isLoading = true;

      return Promise.all([
        this.service.getcriteriasss(this.queries[0]).toPromise(),
        this.service.getcriteriasss(this.queries[1]).toPromise(),
        this.service.getcriteriasss(this.queries[2]).toPromise(),
        this.service.getcriteriasss(this.queries[3]).toPromise(),
        this.service.getcriteriasss(this.queries[5]).toPromise()
      ]).then(
        res => {
          this.vendorsData = <any>res[0];
          this.costCentersData = <any>res[1];
          this.buyerData = <any>res[2];
          this.termsData = <any>res[3];
          this.accData = <any>res[4];
          this.isLoading = false;
        }
      )
    }

    getGridData(criteria) {
      this.service.gridData(this.queries[4], criteria)
        .then(
          res => {
            this.gridData = JSON.parse(<any>res)
          }
        )
    }

  //#endregion 

  //#region 

    // recive data from child components
    // Mohammed Hamouda - 07/04/2021

    onHeaderFormChange(val) {
      this.currentFormVal = val;
      (this.currentFormVal.VendCode == '') ? this.isActiveGrid = false : this.isActiveGrid = true;          
    }

    onContactFormChange(val) {
      this.currentContactVal = val;
    }

    onGridChange(val) {
      this.gridReviced = val;
    }

  //#endregion

  ngOnChanges(changes: SimpleChanges) {
    // check new data
    const isChanged = setInterval(() => {
      if (typeof (changes.data) == 'undefined') {
        null;
      } else {
        this.data = changes.data.currentValue;

        if (this.data.length == 1) {
          this.currentFormVal = this.data;
          this.dataSentToForms = this.data;
          this.gridReviced = [];
          this.getGridData(`PurchaseAccDtl.PurNum = '${this.data[0]['BillNum']}'`);
        }

        clearInterval(isChanged);
      }
    }, 100);
    
    // check new record
   const isReset = setInterval(() => {
      if (typeof (changes.isReset) == 'undefined') {
        null;
      } else {
        this.isReset = changes.isReset.currentValue;

        if (this.isReset) {

          if (this.isNewRecord) {
          
          }
        }

        clearInterval(isReset);
      }
    }, 100);   

    // check delete record
    const isDelete = setInterval(() => {
      if (typeof (changes.isDelete) == 'undefined') {
        null;
      } else {
        this.isDelete = changes.isDelete.currentValue;
        if (this.isDelete) {
             
        }

        clearInterval(isDelete);
      }
    }, 100);
    
    // check save or update record
    const isSaveOrUpdate = setInterval(() => {
      if (typeof (changes.isSaveOrUpdate) == 'undefined') {
        null;
      } else {
        this.isSaveOrUpdate = changes.isSaveOrUpdate.currentValue;
        if (this.isSaveOrUpdate) {
          let formObj = Object.assign({}, this.currentFormVal, this.currentContactVal);
          console.log(formObj)
          console.log(this.gridReviced)
        }

        clearInterval(isSaveOrUpdate);
      }
    }, 100); 

    // check refresh grid
    const isRefresh = setInterval(() => {
      if (typeof (changes.isRefresh) == 'undefined') {
        null;
      } else {
        this.isRefresh = changes.isRefresh.currentValue;

        clearInterval(isRefresh);
      }
    }, 100);    
    
    // check report
    const isReporting = setInterval(() => {
      if (typeof (changes.isReporting) == 'undefined') {
        null;
      } else {
        this.isReporting = changes.isReporting.currentValue;

        if (this.isReporting) {
          //this.returnID.emit(this.voucherForm.get('Serial').value);
        }

        clearInterval(isReporting);
      }
    }, 100);  
        
  }     


}
