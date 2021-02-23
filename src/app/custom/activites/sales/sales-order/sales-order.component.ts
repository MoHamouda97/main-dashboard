import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatabindingService } from 'src/services/databinding.service';
import { FrmService } from 'src/services/frm/frm.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as $ from 'jquery';
import * as lang from './../../../../../settings/lang';
import { validateHorizontalPosition } from '@angular/cdk/overlay';

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.css']
})
export class SalesOrderComponent implements OnInit, OnChanges, AfterViewInit {
  // form var
  salesOrderForm: FormGroup;
  gridSalesForm: FormGroup;
  isApproved;
  deliveryOrder;

  // extchange data between parent and child
  @Input('data') data = [];
  @Input('objID') objID = 339;
  @Input('isReset') isReset = false;
  @Input('isDelete') isDelete = false;
  @Input('isSaveOrUpdate') isSaveOrUpdate = false;
  @Input('isReporting') isReporting = false;
  @Output('returnData') returnData : EventEmitter<any> = new EventEmitter();
  @Output('returnID') returnID : EventEmitter<any> = new EventEmitter();
  @Output('returnEmail') returnEmail: EventEmitter<any> = new EventEmitter();

  // language
  lang: any;  

  // show / hide popup
  isVisible: boolean = false;

  // sql statments
  queries: any[] = [
    "SELECT PersonCode,PersonName From Persons WHERE PersonType=3 Order By PersonCode",
    "Select Terms,CreditFor From Terms  Order By Terms",
    "select * from SalDeliveryMethods",
    "select * from persons",
    "SELECT  Persons.PersonCode as CustCode , Persons.PersonName as PersonName ,Persons.CurrencyCode, Currencies.CurrencyName,Currencies.ChangeRate, Persons.CategoryCode FROM Persons INNER JOIN Currencies ON Persons.CurrencyCode = Currencies.CurrencyCode WHERE (Persons.PersonType = 1 AND BranchCode='" + localStorage.getItem('branchCode') + "' AND Persons.Active=1) Order By PersonCode",
  ];
  // for track validatable values
  @ViewChild('customers', {static: true}) customers: ElementRef; 
  @ViewChild('terms', {static: true}) terms: ElementRef;
  @ViewChild('methods', {static: true}) methods: ElementRef;
  @ViewChild('salesMen', {static: true}) salesMen: ElementRef;
  @ViewChild('quotNum', {static: true}) quotNum: ElementRef;
  @ViewChild('itemCode', {static: true}) itemCode: ElementRef;

  // popup data
  popupData: any = [];
  tblData: any = [];
  original: any = [];
  popupType: string = '';
  pouppTitle: string = '';
  customersData: any = [];
  termsData: any = [];
  methodsDtat: any = [];
  salesMenData: any = [];
  quotNumData: any[] = [];

  // check cust code
  custCode: string = '';

  // add row to grid
  isQuotNum: boolean = false;

  // auth
  auth: any = {};

  constructor(
    private service: FrmService, 
    private binding: DatabindingService,
    private notification: NzNotificationService,  
    private fb: FormBuilder) { }

  ngOnInit() {
    this.salesOrderForm = this.fb.group({
      Address: [""],
      AltrFax: [""],
      AltrPhone: [""],
      AltrTelx: [""],
      Amount: [""],
      Approved: [""],
      ApprovedBy: [""],
      ApprovedDate: [""],
      BranchCode: [localStorage.getItem("branchCode")],
      BrnSerial: [""],
      Canceled: [false],
      ChangeRate: [""],
      Contact: [""],
      ContactTitle: [""],
      CurrencyCode: [""],
      CurrencyName: [""],
      CustCode: [""],
      DeliveryDate: [""],
      DeliveryMethod: [""],
      DeliveryMethodCode: [""],
      DeliveryOrder: [""],
      E_Mail: [""],
      Fax: [""],
      IsPosted: [""],
      IssuedBy: [""],
      ModifiedBy: [""],
      Notes: [""],
      OrderDate: [""],
      OrderNum: [""],
      OthContact: [""],
      OthContactTitle: [""],
      PersonName: [""],
      Phone: [""],
      PoBox: [""],
      PurOrder: [""],
      SalesMan: [""],
      ServerCode: [localStorage.getItem("branchCode")],
      ShipAddress: [""],
      ShipAltrFax: [""],
      ShipAltrPhone: [""],
      ShipAltrTelx: [""],
      ShipFax: [""],
      ShipPhone: [""],
      ShipPoBox: [""],
      ShipTelx: [""],
      Telx: [""],
      Terms: [""],
      netAmount: [""],
      VAT: [""]
    });

    this.gridSalesForm = this.fb.group({
      QuotNum: [""],
      ItemCode: [""],
      ItemName: [""],
      OrderedQty: ["1"],
      Price: [""],
      SubTotal: [""],
      CanceledQty: ["0"],
      Issued: [""],
      Invoiced: [""],
      ListPrice: [""],
      Percentage: [""]
    });

    // responding to language change
    this.binding.checkIsLangChanged.subscribe(
      res => {
        if (res != null) {
          this.lang = (res == 'EN') ? lang.en : lang.ar;
        }              
      }
    );

    this.lang = (localStorage.getItem('lang') == 'EN') ? lang.en : lang.ar;   
    
    this.getAllData();
  }

  ngAfterViewInit() {
    this.customers.nativeElement.focus();
  }

  //#region 

  getAllData() { // get all data
    return Promise.all([
      this.service.getcriteriasss(this.queries[0]).toPromise(), 
      this.service.getcriteriasss(this.queries[1]).toPromise(),
      this.service.getcriteriasss(this.queries[2]).toPromise(),
      this.service.getcriteriasss(this.queries[4]).toPromise(),
      this.service.frmSalesOrderLoad(localStorage.getItem('branchCode'), localStorage.getItem('username')).toPromise()])
      .then(res => {
        this.salesMenData = <any>res[0];
        this.termsData = <any>res[1];
        this.methodsDtat = <any>res[2];
        this.customersData = <any>res[3];
        this.auth = <any>res[4];

        // auth
        (!this.auth.ChangeSalesman) && this.salesOrderForm.get('SalesMan').disable();
        (!this.auth.ChangeTerms) && this.salesOrderForm.get('Terms').disable();
        (!this.auth.AllowApprove) && this.salesOrderForm.get('Notes').disable();
        (!this.auth.AllowApprove) && this.salesOrderForm.get('ApprovedBy').disable();
        (!this.auth.AllowApprove) && this.salesOrderForm.get('ApprovedDate').disable();

      })
      .catch(err => {
        this.showNotification('error', this.lang.genericErrMsgTitle, this.lang.genericErrMsgDetails)
      })
  }  

  showNotification(type, title, message) { // notification
    let options = (this.getLang() == 'EN') ? {nzClass: 'lang-en'} : {nzClass: 'lang-ar'};
    this.notification.create(type, title, message, options);
  }  

  //#endregion  

  //#region 

    // check lang

    getLang() {
      return localStorage.getItem('lang');
    }  

  //#endregion  

  //#region 

    // deal with length of data recived from search component
    // Mohammed Hamouda - 09/02/2021

    displayData(data: any) {
      console.log(data)
      this.salesOrderForm.get('Address').setValue(data[0].Address);
      this.salesOrderForm.get('AltrFax').setValue(data[0].AltrFax);
      this.salesOrderForm.get('AltrPhone').setValue(data[0].AltrPhone);
      this.salesOrderForm.get('AltrTelx').setValue(data[0].AltrTelx);
      this.salesOrderForm.get('Amount').setValue(data[0].Amount);
      this.isApproved =  <string>data[0].Approved.toString();
      this.salesOrderForm.get('ApprovedBy').setValue(data[0].ApprovedBy);
      this.salesOrderForm.get('ApprovedDate').setValue(data[0].ApprovedDate);
      this.salesOrderForm.get('BranchCode').setValue(data[0].BranchCode);
      this.salesOrderForm.get('BrnSerial').setValue(data[0].BrnSerial);
      this.salesOrderForm.get('Canceled').setValue((data[0].Canceled == 0) ? false : true);
      this.salesOrderForm.get('ChangeRate').setValue(data[0].ChangeRate);
      this.salesOrderForm.get('Contact').setValue(data[0].Contact);
      this.salesOrderForm.get('ContactTitle').setValue(data[0].ContactTitle);
      this.salesOrderForm.get('CurrencyCode').setValue(data[0].CurrencyCode);
      this.salesOrderForm.get('CurrencyName').setValue(data[0].CurrencyName);
      this.salesOrderForm.get('CustCode').setValue(data[0].CustCode);
      this.salesOrderForm.get('DeliveryDate').setValue(data[0].DeliveryDate);
      this.salesOrderForm.get('DeliveryMethod').setValue(data[0].DeliveryMethod);
      this.salesOrderForm.get('DeliveryMethodCode').setValue(data[0].DeliveryMethodCode);
      this.deliveryOrder = <any>data[0].DeliveryOrder.toString();
      this.salesOrderForm.get('E_Mail').setValue(data[0].E_Mail);
      this.salesOrderForm.get('Fax').setValue(data[0].Fax);
      this.salesOrderForm.get('IsPosted').setValue(data[0].IsPosted);
      this.salesOrderForm.get('IssuedBy').setValue(data[0].IssuedBy);
      this.salesOrderForm.get('ModifiedBy').setValue(data[0].ModifiedBy);
      this.salesOrderForm.get('Notes').setValue(data[0].Notes);
      this.salesOrderForm.get('OrderDate').setValue(data[0].OrderDate);
      this.salesOrderForm.get('OrderNum').setValue(data[0].OrderNum);
      this.salesOrderForm.get('OthContact').setValue(data[0].OthContact);
      this.salesOrderForm.get('OthContactTitle').setValue(data[0].OthContactTitle);
      this.salesOrderForm.get('PersonName').setValue(data[0].PersonName);
      this.salesOrderForm.get('Phone').setValue(data[0].Phone);
      this.salesOrderForm.get('PoBox').setValue(data[0].PoBox);
      this.salesOrderForm.get('PurOrder').setValue(data[0].PurOrder);
      this.salesOrderForm.get('SalesMan').setValue(data[0].SalesMan);
      this.salesOrderForm.get('ServerCode').setValue(data[0].ServerCode);
      this.salesOrderForm.get('ShipAddress').setValue(data[0].ShipAddress);
      this.salesOrderForm.get('ShipAltrFax').setValue(data[0].ShipAltrFax);
      this.salesOrderForm.get('ShipAltrPhone').setValue(data[0].ShipAltrPhone);
      this.salesOrderForm.get('ShipAltrTelx').setValue(data[0].ShipAltrTelx);
      this.salesOrderForm.get('ShipFax').setValue(data[0].ShipFax);
      this.salesOrderForm.get('ShipPhone').setValue(data[0].ShipPhone);
      this.salesOrderForm.get('ShipPoBox').setValue(data[0].ShipPoBox);
      this.salesOrderForm.get('ShipTelx').setValue(data[0].ShipTelx);
      this.salesOrderForm.get('Telx').setValue(data[0].Telx);
      this.salesOrderForm.get('Terms').setValue(data[0].Terms);

      //this.salesOrderForm.disable();
    }

  //#endregion 

  //#region working with table and popup 

    handleCancel(){ // close popup
      this.isVisible = false;
    }  

    // get data for pop up
    // Mohammed Hamouda - 09/02/2021

    fillPopUp(index, type) {
      this.popupType = type;

      if (index == 4) {
        this.data = this.customersData;
        this.pouppTitle = 'Customers';
      } else if (index == 0) {
        this.data = this.salesMenData;
        this.pouppTitle = 'Sales Men';
      } else if (index == 1) {
        this.data = this.termsData;
        this.pouppTitle = 'Payment Terms';
      } else if (index == 2) {        
        for (let i = 0; i <= this.methodsDtat.length - 1; i++) {
          delete this.methodsDtat[i].DateCreated;
          delete this.methodsDtat[i].DateModified
          delete this.methodsDtat[i].Issued_By
          delete this.methodsDtat[i].Notes
        }

        this.data = this.methodsDtat;

        this.pouppTitle = 'Delivery Methods';
      }
      
      this.original = this.data;
      this.isVisible = true;
    }

  // this function is used to recive data from table pagination
  tblPageChangeHandler(data){
    this.tblData = data;
  } 
  
  onItemClicked(index) {

    switch(this.popupType) {
      case 'SalesMen' :
        this.salesOrderForm.get('SalesMan').setValue(this.tblData[index].PersonCode);
        break;
      case 'terms' :
        this.salesOrderForm.get('Terms').setValue(this.tblData[index].Terms);
        if (this.tblData[index].CreditFor == -1) {
          this.terms.nativeElement.focus();
          this.showNotification('warning', this.lang.inActivePaymentTermMsgTitle, this.lang.inActivePaymentTermMsgDetails);          
        } 
        break; 
      case 'DeliveryMethod' :
        this.salesOrderForm.get('DeliveryMethod').setValue(this.tblData[index].DeliveryMethod);
        break;
      case 'Customers' :
        this.custCode = this.tblData[index].CustCode;

        this.salesOrderForm.get('CustCode').setValue(this.tblData[index].CustCode);
        this.salesOrderForm.get('PersonName').setValue(this.tblData[index].PersonName);

        this.salesOrderForm.get('CurrencyName').setValue(this.tblData[index].CurrencyName);
        this.salesOrderForm.get('ChangeRate').setValue(this.tblData[index].ChangeRate);        
        break;
      case 'QuotNum' :
        $('#QuotNum').val(this.tblData[index].QuotNum);
        break;                                                         
    }

    this.isVisible = false;
  }
  
  filterData(key, val) {  // filter

    (val == '') 
      ? this.data = this.original
      : this.data = this.data.filter(d => d[key].toString().toLocaleLowerCase().trim().includes(val.toLocaleLowerCase().trim()));
  } 
  
  reset() { // reset data
    this.data = this.original;
  }  

  //#endregion 
  
  //#region // validate data 

  findData(val) { // when user write customer code
    let data: any;

    data = this.customersData.filter(c => c.CustCode == val);
    if (data.length > 0) {
      this.salesOrderForm.get('CustCode').setValue(data[0].CustCode);
      this.salesOrderForm.get('PersonName').setValue(data[0].PersonName);
    } else {
      this.salesOrderForm.get('PersonName').reset();
    }
  }

  checkIsHaveVal(type) { // conditions when user leave the input
    let value;
    
    switch(type) {
      case 'customers' :
        value = this.salesOrderForm.get('CustCode').value;
        let personName = this.salesOrderForm.get('PersonName').value;
        if (value != "" && personName == null) {
          this.binding.showMessage("validValue");
          this.customers.nativeElement.focus();
          return;
        }

        this.custCode = value;
        break;
      case 'salesMen' :        
        value = this.salesOrderForm.get('SalesMan').value; 
        let checkSalesMan = this.salesMenData.filter(s => s.PersonCode == value);     
        if (value != "" && checkSalesMan.length == 0) {
          this.binding.showMessage("validValue");
          this.salesMen.nativeElement.focus();
        } 
        break; 
      case 'terms' :        
        value = this.salesOrderForm.get('Terms').value; 
        let checkTerms = this.termsData.filter(t => t.Terms == value);     
        if (value != "" && checkTerms.length == 0) {
          this.binding.showMessage("validValue");
          this.terms.nativeElement.focus();
        } else {
          if (checkTerms[0].CreditFor == -1) {            
            this.terms.nativeElement.focus();
          }
        }        
        break;   
      case 'methods' :        
        value = this.salesOrderForm.get('DeliveryMethod').value; 
        let checkMethods = this.methodsDtat.filter(m => m.DeliveryMethod == value);     
        if (value != "" && checkMethods.length == 0) {
          this.binding.showMessage("validValue");
          this.methods.nativeElement.focus();
        }
        break; 
      case 'quotNum' :
        value = $('#QuotNum').val();
        let qoutNum = this.quotNumData.filter(q => q.QuotNum == value);
        if (value != "" && qoutNum.length == 0) {
          this.binding.showMessage("validValue");
          this.quotNum.nativeElement.focus();
        }
        break;                                                    
    }
  }  

  //#endregion
  
  //#region 

  // Mohammed Hamouda - 21/02/2021

  hideGrid() { // hide grid
    $('#js_sales_grid').hide();
    $('#js_sales_grid_form').fadeIn();
  }

  getQuots() { // get quots
    if (this.custCode != '') {
      this.isQuotNum = true;

      let quotNumQuery = `SELECT  QuotNum, QuotDate, ExpDate, Canceled, Approved FROM SalQuotationsHdr WHERE (CustCode='${this.custCode}') AND Canceled = 0 ORDER BY QuotNum`
      let criteria = ""

      this.service.LoadPopUpCheck(quotNumQuery, criteria).toPromise()
        .then((res) => {
          this.data = JSON.parse(<any>res);
          this.quotNumData = JSON.parse(<any>res);

          this.popupType = 'QuotNum';
          this.pouppTitle = 'Quotations';

          this.isVisible = true;
          this.isQuotNum = false;
        }).catch()
      return;
    }

    this.binding.showMessage('noCustomer');

  }  

  //#endregion

  //#region 
  
  // calc operations
  // Mohammed Hamouda - 22/02/2021

  calc(val) { // amount

    if (val == '') {
      val = 1;
      this.gridSalesForm.get('OrderedQty').setValue('1');
      this.binding.showMessage('quntity');
    }

    const total = parseFloat(val) * parseFloat(this.gridSalesForm.get('Price').value);

    this.salesOrderForm.get('Amount').setValue(total);
    this.gridSalesForm.get('SubTotal').setValue(total);

    this.vat(total);
  }

  vat(total) { // tax
    const system = JSON.parse(localStorage.getItem('systemVariables'));
    const rate = system[0].Glb_VAT_Ratio;
    const vat = (total * rate) / 100;
    const afterVat = total - vat;

    this.salesOrderForm.get('VAT').setValue(rate);
    this.salesOrderForm.get('netAmount').setValue(afterVat);
  }

  //#endregion

  //#region 

  // check item code
  // MohammedHamouda - 22/02/2021
  
  checkItemCode() {
    const itemCode = this.gridSalesForm.get('ItemCode').value;

    /*if (itemCode == "" || itemCode == null) {
      this.binding.showMessage('missingItemCode');
      this.itemCode.nativeElement.focus();
    }*/
  }

  //#endregion

  ngOnChanges(changes: SimpleChanges) {
    // check new data
    const isChanged = setInterval(() => {
      if (typeof (changes.data) == 'undefined') {
        null;
      } else {
        this.data = changes.data.currentValue;
        (this.data.length == 1) ? this.displayData(this.data) : null;
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
          this.salesOrderForm.reset();          
          this.isApproved = '1';
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
          let data = this.salesOrderForm.value;

          this.returnData.emit(data);
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
                  
        }

        clearInterval(isSaveOrUpdate);
      }
    }, 100); 
    
    // check save or update record
    const isReporting = setInterval(() => {
      if (typeof (changes.isReporting) == 'undefined') {
        null;
      } else {
        this.isReporting = changes.isReporting.currentValue;

        if (this.isReporting) {
          //this.returnID.emit(this.customerRequestForm.get('RequestNum').value);
        }

        clearInterval(isReporting);
      }
    }, 100);
  }   

}
