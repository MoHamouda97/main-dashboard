import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { DatabindingService } from 'src/services/databinding.service';
import { FrmService } from 'src/services/frm/frm.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as $ from 'jquery';
import * as lang from './../../../../../settings/lang';
import * as _ from 'lodash';

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrls: ['./sales-order.component.css']
})
export class SalesOrderComponent implements OnInit, OnChanges, AfterViewInit {
  // form var
  salesOrderForm: FormGroup;
  gridSalesForm: FormGroup;
  isApproved: string = '0';
  deliveryOrder: string = '1';

  // extchange data between parent and child
  @Input('data') data = [];
  @Input('objID') objID = 339;
  @Input('isReset') isReset = false;
  @Input('isDelete') isDelete = false;
  @Input('isSaveOrUpdate') isSaveOrUpdate = false;
  @Input('isRefresh') isRefresh = false;
  @Input('isReporting') isReporting = false;
  @Output('returnData') returnData : EventEmitter<any> = new EventEmitter();
  @Output('returnID') returnID : EventEmitter<any> = new EventEmitter();
  @Output('returnEmail') returnEmail: EventEmitter<any> = new EventEmitter();

  // loader
  isLoading: boolean = true;

  // for displaying data in grid
  gridData: any = {};

  // language
  lang: any;  

  // show / hide popup
  isVisible: boolean = false;

  // toggle between update and add grid btn
  isAdd: boolean = true;

  // sql statments
  queries: any[] = [
    "SELECT PersonCode,PersonName From Persons WHERE PersonType=3 Order By PersonCode",
    "Select Terms,CreditFor From Terms  Order By Terms",
    "select * from SalDeliveryMethods",
    "select * from persons",
    "SELECT  Persons.PersonCode as CustCode , Persons.PersonName as PersonName ,Persons.CurrencyCode, Currencies.CurrencyName,Currencies.ChangeRate, Persons.CategoryCode FROM Persons INNER JOIN Currencies ON Persons.CurrencyCode = Currencies.CurrencyCode WHERE (Persons.PersonType = 1 AND BranchCode='" + localStorage.getItem('branchCode') + "' AND Persons.Active=1) Order By PersonCode",
    "SELECT SalQuotationsDtl.QuotNum, SalesOrderDtl.ItemCode, ItemsDirectory.ItemName, SalesOrderDtl.OrderedQty, SalesOrderDtl.Price, SalesOrderDtl.Qty * SalesOrderDtl.Price AS SubTotal, SalesOrderDtl.OrderedQty - SalesOrderDtl.Qty AS CanceledQty, SalesOrderDtl.Qty, (CASE WHEN ItemsDirectory.ItemType = 0 THEN SUM(Tbl_Issued.Issued) ELSE SUM(SalesOrderDtl.Qty) END) AS Issued, Tbl_Invoiced.Invoiced, SalesOrderDtl.Quot_ID, SalesOrderDtl.ID, CASE Persons.CategoryCode WHEN 1 THEN ItemsDirectory.SalPrice1 WHEN 2 THEN ItemsDirectory.SalPrice2 WHEN 3 THEN ItemsDirectory.SalPrice3 WHEN 4 THEN ItemsDirectory.SalPrice4 WHEN 5 THEN ItemsDirectory.SalPrice5 END AS ListPrice, ROUND((CASE WHEN (CASE Persons.CategoryCode WHEN 1 THEN ItemsDirectory.SalPrice1 WHEN 2 THEN ItemsDirectory.SalPrice2 WHEN 3 THEN ItemsDirectory.SalPrice3 WHEN 4 THEN ItemsDirectory.SalPrice4 WHEN 5 THEN ItemsDirectory.SalPrice5 END) = 0 THEN 0 ELSE ((((CASE Persons.CategoryCode WHEN 1 THEN ItemsDirectory.SalPrice1 WHEN 2 THEN ItemsDirectory.SalPrice2 WHEN 3 THEN ItemsDirectory.SalPrice3 WHEN 4 THEN ItemsDirectory.SalPrice4 WHEN 5 THEN ItemsDirectory.SalPrice5 END) - SalesOrderDtl.Price) / (CASE Persons.CategoryCode WHEN 1 THEN ItemsDirectory.SalPrice1 WHEN 2 THEN ItemsDirectory.SalPrice2 WHEN 3 THEN ItemsDirectory.SalPrice3 WHEN 4 THEN ItemsDirectory.SalPrice4 WHEN 5 THEN ItemsDirectory.SalPrice5 END)) * 100) END), 2) AS Percentage FROM (SELECT SalesHdr_1.OrderNum, SalesDtl_1.ItemCode, SUM(ItemsInOutL_1.Qty) AS Issued FROM SalesDtl AS SalesDtl_1 RIGHT OUTER JOIN SalesHdr AS SalesHdr_1 ON SalesDtl_1.SaleNum = SalesHdr_1.SaleNum LEFT OUTER JOIN ItemsInOutL AS ItemsInOutL_1 ON SalesDtl_1.ID = ItemsInOutL_1.Trn_ID GROUP BY SalesDtl_1.ItemCode, SalesHdr_1.OrderNum) AS Tbl_Issued RIGHT OUTER JOIN Persons INNER JOIN ItemsDirectory INNER JOIN SalesOrderDtl ON ItemsDirectory.ItemCode = SalesOrderDtl.ItemCode INNER JOIN SalesOrderHdr ON SalesOrderDtl.OrderNum = SalesOrderHdr.OrderNum ON Persons.PersonCode = SalesOrderHdr.CustCode LEFT OUTER JOIN (SELECT SalesHdr_1.OrderNum, SalesDtl_1.ItemCode, SUM(SalesDtl_1.Qty) AS Invoiced FROM SalesDtl AS SalesDtl_1 RIGHT OUTER JOIN SalesHdr AS SalesHdr_1 ON SalesDtl_1.SaleNum = SalesHdr_1.SaleNum GROUP BY SalesDtl_1.ItemCode, SalesHdr_1.OrderNum) AS Tbl_Invoiced ON SalesOrderDtl.ItemCode = Tbl_Invoiced.ItemCode AND SalesOrderDtl.OrderNum = Tbl_Invoiced.OrderNum ON Tbl_Issued.OrderNum = SalesOrderDtl.OrderNum AND Tbl_Issued.ItemCode = SalesOrderDtl.ItemCode LEFT OUTER JOIN SalQuotationsDtl ON SalesOrderDtl.Quot_ID = SalQuotationsDtl.ID GROUP BY SalesOrderDtl.ItemCode, ItemsDirectory.ItemName, SalesOrderDtl.Qty, SalesOrderDtl.OrderedQty, SalesOrderDtl.Price, SalesOrderDtl.Qty * SalesOrderDtl.Price, SalesOrderDtl.ID, ItemsDirectory.ItemType, SalQuotationsDtl.QuotNum, SalesOrderDtl.Quot_ID, CASE Persons.CategoryCode WHEN 1 THEN ItemsDirectory.SalPrice1 WHEN 2 THEN ItemsDirectory.SalPrice2 WHEN 3 THEN ItemsDirectory.SalPrice3 WHEN 4 THEN ItemsDirectory.SalPrice4 WHEN 5 THEN ItemsDirectory.SalPrice5 END, Tbl_Invoiced.Invoiced ORDER BY CASE WHEN ItemsDirectory.ItemType < 3 THEN 0 ELSE 99 END, CONVERT(int, RTRIM(LTRIM(RIGHT(SalesOrderDtl.ID, CHARINDEX('_', REVERSE(SalesOrderDtl.ID)) - 1))))",    
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
  itemCodeData: any[] = [];

  // extract from customer
  custCode: string = '';
  customerCode: string = '';
  personName: string = '';
  catCode: string = '';
  QuotNum: string = '';
  QuotID: string = '';
  creditFor: any = 0;

  // add row to grid
  isQuotNum: boolean = false;
  isItems: boolean = false;

  // auth
  auth: any = {};
  canEditPrice: any;

  // add item
  i: number = 0;
  arrOfItems: any[] = [];

  // index of item to be updated
  indexOfItemToBeUpdated: number;

  // type of sales order
  sosType: string = 'inProgress';
  sosStatus: string = 'new order';
  isCompleted: boolean = false;
  isCustDisabled: boolean = false;

  // if user edit tax item
  isTax: boolean = false;

  // tax obj
  autoTaxObj: any = {};
  taxArr: any[] = [];

  // header
  header: any = {
    gridIndex : "",
    childs: "OrderNum",
    masters: "",
    keycols: 11,
    gridcolnum: 14,
    gridrowlnum: 0,
    m_IDCol: "SORD;11;1",
    gridTableName: "SalesOrderDtl",
    beforeCommitObject: ""
  }

  // items recived from DB
  itemsRecived: any [] = [];
  itemsRecivedWitoutFilter: any[] = [];

  // save original data to compare with
  originalSalesData;

  // email var
  headerArray = ['OrderNum', 'OrderDate', 'PersonName', 'Amount', 'CurrencyName', 'SalesMan', 'Terms'];
  mailKeys = ['Item Code', 'Item Name', 'Qty', 'Price', 'Sub Total', 'List Price', 'Percentage'];
  invoicKeys = ["ItemCode", "ItemName", "OrderedQty", "CanceledQty", "Price", "SubTotal", "Invoiced"]

  // invoiced var
  invoiceToBeUpdated: any = {};
  allowUpdateInvoic: boolean = false;
  invoiceObj: any = {};
  InvQty: any = 0;
  SOFQty: any = 0;
  currentOrdered: any = 0;
  currentCancelled: any = 0;

  // always disabled
  isAlwaysDisabled: boolean = true;

  // check is save or update
  isNewOrUpdate: number = 0;

  // system
  system = JSON.parse(localStorage.getItem('systemVariables'));

  // is valid item code
  isValidItemCode: boolean = false;

  // is added new order
  isNewOrderAdded: boolean = false;

  // update after check tax
  canUpdate: boolean = false;

  // grid visability
  isShowGrid: boolean = true;

  // item id
  itemId: number;

  constructor(
    private service: FrmService, 
    private binding: DatabindingService,
    private notification: NzNotificationService,  
    private modal: NzModalService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.salesOrderFormGenerator();

    this.gridSalesForm = this.fb.group({
      QuotNum: [""],
      ItemCode: ["", [Validators.required]],
      ItemName: [""],
      OrderedQty: ["1"],
      Price: [""],
      SubTotal: [""],
      CanceledQty: ["0"],
      Qty: [""],
      Issued: [""],
      Invoiced: [""],
      Quot_ID: [""],
      ID: [""],
      ListPrice: [""],
      Percentage: ["0"]
    });

    this.gridData = this.gridSalesForm.getRawValue();

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

    // check removing item from grid
    this.binding.checkItemRemoved.subscribe(
      res => {
        if (res != null) {
          this.removeFromArrOfItems(res);
        }
      }
    )

    // check item to be updated
    this.binding.checkItemUpdate.subscribe(
      res => {
        if (res != null) {
          const itemToBeUpdated = this.arrOfItems[res];          
          this.indexOfItemToBeUpdated = res;
          this.isAdd = false;
          this.checkInvoic(itemToBeUpdated);  
          this.isValidItemCode = true; 
          this.itemId = this.arrOfItems[this.indexOfItemToBeUpdated].id          
        }
      }
    )
    
    this.getCurrentDate();

    this.binding.sendOrderStatus(['new order', 'inProgress']); 
  }

  ngAfterViewInit() {
    this.customers.nativeElement.focus();
  }

  salesOrderFormGenerator() {
    this.salesOrderForm = this.fb.group({
      Address: [""],
      AltrFax: [""],
      AltrPhone: [""],
      AltrTelx: [""],
      Amount: [""],
      Approved: ["0"],
      ApprovedBy: [""],
      ApprovedDate: [""],
      BranchCode: [localStorage.getItem("branchCode")],
      BrnSerial: [""],
      Canceled: [false],
      ChangeRate: [""],
      Contact: [""],
      ContactTitle: [""],
      CurrencyCode: [""],
      CurrencyName: {value: '', disabled: true},
      CustCode: [""],
      DeliveryDate: [""],
      DeliveryMethod: [""],
      DeliveryMethodCode: [""],
      DeliveryOrder: ["1"],
      E_Mail: [""],
      Fax: [""],
      IssuedBy: [""],
      ModifiedBy: [""],
      Notes: [""],
      OrderDate: [""],
      OrderNum: [""],
      OthContact: [""],
      OthContactTitle: [""],
      PersonName: {value: '', disabled: true},
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

  }

  getCurrentDate() { // get server date
    this.service.getCurrentDate("MM/dd/yyyy").toPromise()
      .then(res => {
        this.salesOrderForm.get('OrderDate').setValue(<string>res);
        this.salesOrderForm.get('DeliveryDate').setValue(this.formatDate(<string>res, 'delivery'));
        this.salesOrderForm.get('ApprovedDate').setValue(<string>res);
      })
      .catch(err => this.showNotification("err", this.lang.genericErrMsgTitle, err));
  } 
  
  //#region 

    // format date to SQL format
    // Mohammed Hamouda 09/02/2021

    formatDate(date, type = '') {
      let d = new Date(date),
          month = '' + (d.getMonth() + 1), 
          day = '' + d.getDate(),
          year = d.getFullYear();
      
      if(type != '') {
        month = '' + (parseInt(month) + 2)
      }
        
      if (month.length < 2)
        month = '0' + month;
      if (day.length < 2) 
        day = '0' + day;
      
      if(type != '')
        return `${month}/${day}/${year}`;

      return `${day}/${month}/${year}`;
    }

  //#endregion  

  //#region 

  getAllData() { // get all data
    this.isLoading = true;
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

        // set auth
        this.setAuth();
        
        // set default values for order
        this.setDefaultValues();

        this.isLoading = false;

      })
      .catch(err => {
        this.showNotification('error', this.lang.genericErrMsgTitle, this.lang.genericErrMsgDetails)
      })
  } 

  setAuth() { // set auth
    (!this.auth.AllowApprove) && this.salesOrderForm.get('ApprovedBy').disable();
    (!this.auth.AllowApprove) && this.salesOrderForm.get('ApprovedDate').disable();
    (!this.auth.AllowApprove) && this.salesOrderForm.get('Notes').disable();
    (!this.auth.ChangeSalesman) && this.salesOrderForm.get('SalesMan').disable();
    (this.auth.disablecols) && this.gridSalesForm.get('Price').disable(); 
  }
    

  setDefaultValues() { // set default values 
    let terms = this.termsData.filter(t => t.Terms === this.system[1]["DefTerms"]);
    if (terms.length > 0) {
      this.salesOrderForm.get('Terms').setValue(terms[0]['Terms']);
      this.creditFor = terms[0]['CreditFor'];
    } else {
      this.salesOrderForm.get('Terms').setValue(this.termsData[0]['Terms']);
      this.creditFor = this.termsData[0]['CreditFor'];  
    } 

    let salesMan = this.salesMenData.filter(s => s.PersonCode == this.system[1]["DefSalesMan"]);

    if (salesMan.length > 0) {
      this.salesOrderForm.get('SalesMan').setValue(salesMan[0]["PersonCode"]);
      this.personName = salesMan[0]["PersonName"];  
    } else {
      this.salesOrderForm.get('SalesMan').setValue(this.salesMenData[0].PersonCode);
      this.personName = this.salesMenData[0].PersonCode;    
    } 

    let delivery = this.methodsDtat.filter(m => m.DeliveryMethodCode == this.system[1]["DefDeliveryMethodCode"])

    if (delivery.length > 0) {
      this.salesOrderForm.get('DeliveryMethod').setValue(delivery[0].DeliveryMethod);
      this.salesOrderForm.get('DeliveryMethodCode').setValue(delivery[0].DeliveryMethodCode);  
    } else {
      this.salesOrderForm.get('DeliveryMethod').setValue(this.methodsDtat[0].DeliveryMethod);
      this.salesOrderForm.get('DeliveryMethodCode').setValue(this.methodsDtat[0].DeliveryMethodCode);  
    }   
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
      this.i = 0;

      this.gridData = [];
      this.taxArr = [];

      this.originalSalesData = data[0];

      this.salesOrderForm.get('Address').setValue(data[0].Address);
      this.salesOrderForm.get('AltrFax').setValue(data[0].AltrFax);
      this.salesOrderForm.get('AltrPhone').setValue(data[0].AltrPhone);
      this.salesOrderForm.get('AltrTelx').setValue(data[0].AltrTelx);
      this.salesOrderForm.get('Amount').setValue(data[0].Amount);
      this.isApproved =  <string>data[0].Approved.toString();
      this.salesOrderForm.get('ApprovedBy').setValue(data[0].ApprovedBy);
      this.salesOrderForm.get('ApprovedDate').setValue((data[0].ApprovedDate == '1/1/1970, 02:00 AM') ? '' : data[0].ApprovedDate);
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

      // get data
      this.isNewOrUpdate = 1;

      this.orderItems(this.salesOrderForm.get('OrderNum').value);

      this.custCode = data[0].CustCode; 
      this.customerCode = data[0].CustCode;  
      this.personName = data[0].PersonName; 
      
      // get credit for
      let creditObj = this.termsData.filter(t => t.Terms == data[0].Terms);
      this.creditFor = creditObj[0]['CreditFor'];

      this.isValidItemCode = true;
    }

  //#endregion
  
  //#region 

    // order Items
    // Mohammed Hamouda - 28/02/2021

    orderItems(orderNum) {      
      let isCanceled = this.salesOrderForm.get('Canceled').value;
      let issued: number = 0;
      let orderQty: number = 0;

      this.resetArrofItems();

      this.service.gridData(this.queries[5],`SalesOrderHdr.OrderNum = '${orderNum}'`)
        .then(res => {
          const items = JSON.parse(<any>res);

          for (let i = 0; i <= items.length - 1; i++) {            
            let issuedItemVal: number = (items[i].Issued == '') ? 0 : parseInt(items[i].Issued);
            let qtyItemVal: number = parseFloat(items[i].OrderedQty);
            
            issued += issuedItemVal;
            orderQty += qtyItemVal;

            if (items[i].QuotNum != "") 
              this.isCustDisabled = true;

            this.addValuesToForm(items[i]);            
            this.addToGrid(items[i], 'recive');                        

            if (i == items.length - 1) {
              this.gridData = this.itemsRecived;
            } 


            this.itemsRecivedWitoutFilter.push(items[i])
          }

          this.isCompleted = false;

          if (isCanceled && issued == 0) {
            this.sosType = 'inProgress';
            this.sosStatus = 'canceled';  
            this.binding.sendOrderStatus(['canceled', 'inProgress']);         
          } else if (isCanceled && issued > 0) {
            this.sosType = 'inProgress';
            this.sosStatus = 'p.canceled';
            this.binding.sendOrderStatus(['p.canceled', 'inProgress']); 
          } else if (issued == 0) {
            this.sosType = 'inProgress';
            this.sosStatus = 'opened';
            this.binding.sendOrderStatus(['opened', 'inProgress']);
          } else if (orderQty <= issued) {
            this.sosType = 'compleated';
            this.sosStatus = 'completed';

            this.salesOrderForm.disable();
            this.gridSalesForm.disable();
            this.isCompleted = true;
            this.binding.checkCompletedOreder(true);

            this.binding.sendOrderStatus(['compleated', 'completed']);
          } else if (issued > 0) {
            this.sosType = 'inProgress';
            this.sosStatus = 'p.completed';
            this.binding.sendOrderStatus(['p.completed', 'inProgress']);
          }
          
          if (this.sosStatus != 'completed') {
            this.salesOrderForm.enable();                      
            this.gridSalesForm.enable();

            this.alwaysDisabledControls(); 
            
            this.binding.checkCompletedOreder(false);        
          }

        }) 
    }

    addValuesToForm(item) {
      this.gridSalesForm.get('QuotNum').setValue(item.QuotNum);
      this.gridSalesForm.get('ItemCode').setValue(item.ItemCode);
      this.gridSalesForm.get('ItemName').setValue(item.ItemName);
      this.gridSalesForm.get('OrderedQty').setValue(item.OrderedQty);
      this.gridSalesForm.get('Price').setValue(item.Price);
      this.gridSalesForm.get('SubTotal').setValue(item.SubTotal);
      this.gridSalesForm.get('CanceledQty').setValue(item.CanceledQty);
      this.gridSalesForm.get('Qty').setValue("");
      this.gridSalesForm.get('Issued').setValue(item.Issued);
      this.gridSalesForm.get('Invoiced').setValue(item.Invoiced);
      this.gridSalesForm.get('Quot_ID').setValue(item.Quot_ID);
      this.gridSalesForm.get('ID').setValue("");
      this.gridSalesForm.get('ListPrice').setValue(item.ListPrice);
      this.gridSalesForm.get('Percentage').setValue(item.Percentage);
    }

    // empty old arr of items
    // Mohammed Hamouda - 02/03/2021
    resetArrofItems() {
      this.i = 0;
      this.gridData = [];
      this.arrOfItems = [];
      this.itemsRecived = [];
      this.itemsRecivedWitoutFilter = [];
    }

  //#endregion

  //#region working with table and popup 

    handleCancel(){ // close popup
      this.isVisible = false;
    }  

    // get data for pop up
    // Mohammed Hamouda - 09/02/2021

    fillPopUp(index, type, event: Event) {
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
        this.salesOrderForm.get('DeliveryMethodCode').setValue(this.tblData[index].DeliveryMethodCode);
        break;
      case 'Customers' :
        this.custCode = this.tblData[index].CustCode;
        this.catCode = this.tblData[index].CategoryCode;

        this.salesOrderForm.get('CustCode').setValue(this.tblData[index].CustCode);
        this.salesOrderForm.get('PersonName').setValue(this.tblData[index].PersonName);

        this.salesOrderForm.get('CurrencyName').setValue(this.tblData[index].CurrencyName);
        this.salesOrderForm.get('ChangeRate').setValue(this.tblData[index].ChangeRate);
        this.salesOrderForm.get('CurrencyCode').setValue(this.tblData[index].CurrencyCode);

        $('#js_sales_grid_form').addClass('add-overlay');

        this.getCustomerData(this.custCode);
        break;
      case 'QuotNum' :
        this.QuotNum = this.tblData[index].QuotNum;
        this.gridSalesForm.get('QuotNum').setValue(this.tblData[index].QuotNum);
        break;
      case 'ItemCode' :
        this.gridSalesForm.get('ItemCode').setValue(this.tblData[index].ItemCode);
        this.gridSalesForm.get('ItemName').setValue(this.tblData[index].ItemName);
        
        (this.tblData[index].hasOwnProperty('ID')) 
          ? this.gridSalesForm.get('Quot_ID').setValue(this.tblData[index].ID)
          : this.gridSalesForm.get('Quot_ID').setValue('');

        if (this.QuotNum != '')  {
          this.gridSalesForm.get('Price').setValue(this.tblData[index].Price);
          this.gridSalesForm.get('ListPrice').setValue(this.tblData[index].Price)
        } else {
          this.gridSalesForm.get('Price').setValue(this.tblData[index][`SalPrice${this.catCode}`]);
          this.gridSalesForm.get('ListPrice').setValue(this.tblData[index][`SalPrice${this.catCode}`]);
        }
          
        this.calc(1);
        this.diasableTaxItems(this.tblData[index])
        this.isValidItemCode = true;
        break;                                                                  
    }

    this.isVisible = false;
  }

  getCustomerData(custCode) {
    const query = `SELECT * FROM Persons WHERE PersonCode = '${custCode}'`;

    this.service.LoadPopUpCheck(query, "").toPromise()
    .then(
      res => {
        const data = JSON.parse(<any>res);

        this.salesOrderForm.get('Address').setValue(data[0].Address);
        this.salesOrderForm.get('AltrFax').setValue(data[0].AltrFax);
        this.salesOrderForm.get('AltrPhone').setValue(data[0].AltrPhone);
        this.salesOrderForm.get('AltrTelx').setValue(data[0].AltrTelx);
        this.salesOrderForm.get('Contact').setValue(data[0].Contact);
        this.salesOrderForm.get('E_Mail').setValue(data[0].E_Mail);
        this.salesOrderForm.get('Fax').setValue(data[0].Fax);
        this.salesOrderForm.get('OthContact').setValue(data[0].OthContact);
        this.salesOrderForm.get('OthContactTitle').setValue(data[0].OthContactTitle);
        this.salesOrderForm.get('Phone').setValue(data[0].Phone);
        this.salesOrderForm.get('PoBox').setValue(data[0].PoBox);
        this.salesOrderForm.get('ShipAddress').setValue(data[0].ShipAddress);
        this.salesOrderForm.get('ShipAltrFax').setValue(data[0].ShipAltrFax);
        this.salesOrderForm.get('ShipAltrPhone').setValue(data[0].ShipAltrPhone);
        this.salesOrderForm.get('ShipAltrTelx').setValue(data[0].ShipAltrTelx);
        this.salesOrderForm.get('ShipFax').setValue(data[0].ShipFax);
        this.salesOrderForm.get('ShipPhone').setValue(data[0].ShipPhone);
        this.salesOrderForm.get('ShipPoBox').setValue(data[0].ShipPoBox);
        this.salesOrderForm.get('ShipTelx').setValue(data[0].ShipTelx);
        this.salesOrderForm.get('Telx').setValue(data[0].Telx);

        // set term
        let term: any[] = this.termsData.filter(t => t.Terms == data[0]["PmtTerms"]);
        
        if (term.length != 0) {
          this.salesOrderForm.get('Terms').setValue(term[0]['Terms']);
          this.creditFor = term[0]['CreditFor'];
        }

        // set sales man
        let salesMan: any[] = this.salesMenData.filter(s => s.PersonCode == data[0]["ContactCode"]);

        if (salesMan.length != 0) {
          this.salesOrderForm.get('SalesMan').setValue(salesMan[0]["PersonCode"]);
          this.personName = salesMan[0]["PersonName"];
        }
      }
    )

  }
  
  filterData(key, val) {  // filter

    (val == '') 
      ? this.data = this.original
      : this.data = this.data.filter(d => d[key].toString().toLocaleLowerCase().trim().includes(val.toLocaleLowerCase().trim()));
  } 
  
  reset() { // reset data
    if (this.popupType == 'QuotNum')
      return;

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
        value = this.gridSalesForm.get('QuotNum').value;
        let qoutNum = this.quotNumData.filter(q => q.QuotNum == value);
        if (value != "" && qoutNum.length == 0) {
          this.binding.showMessage("validValue");
          this.quotNum.nativeElement.focus();
          return;
        }

        this.QuotNum = '';
        break; 
      case 'ItemCode' : // test here
        const salPriceType = `SalPrice${this.catCode}`;
        const criteria = "";
  
        const query = (this.QuotNum == '' || this.QuotNum == null) 
                    ? `SELECT ItemsDirectory.ItemCode, ItemsDirectory.ItemName, ItemsDirectory.${salPriceType}, ItemsDirectory.PartNumber, ItemsBrnQtys.OnHndQty, Tbl_BackOrder.BackOrder, ItemsDirectory.Discontinued, TblLastOrderPrice.LastOrderPrice, TblLastOrderPrice.LastOrderDate FROM (SELECT SalesOrderHdr_2.OrderDate AS LastOrderDate, SalesOrderDtl_2.ItemCode, SalesOrderDtl_2.Price AS LastOrderPrice FROM SalesOrderDtl AS SalesOrderDtl_2 INNER JOIN SalesOrderHdr AS SalesOrderHdr_2 ON SalesOrderDtl_2.OrderNum = SalesOrderHdr_2.OrderNum INNER JOIN (SELECT  MAX(SalesOrderHdr_1.OrderNum) AS LastOrderNum, SalesOrderDtl_1.ItemCode FROM SalesOrderDtl AS SalesOrderDtl_1 INNER JOIN SalesOrderHdr AS SalesOrderHdr_1 ON SalesOrderDtl_1.OrderNum = SalesOrderHdr_1.OrderNum WHERE (SalesOrderHdr_1.CustCode = N'${this.custCode}') GROUP BY SalesOrderDtl_1.ItemCode) AS TblLastDate ON SalesOrderDtl_2.ItemCode = TblLastDate.ItemCode AND SalesOrderHdr_2.OrderNum = TblLastDate.LastOrderNum WHERE (SalesOrderHdr_2.CustCode = N'${this.custCode}')) AS TblLastOrderPrice INNER JOIN ItemsBrnQtys ON TblLastOrderPrice.ItemCode = ItemsBrnQtys.ItemCode RIGHT OUTER JOIN ItemsDirectory LEFT OUTER JOIN (SELECT SalesOrderDtl.ItemCode, SUM(SalesOrderDtl.Qty) - SUM(DISTINCT IssuedTbl.Issued) AS BackOrder  FROM SalesOrderDtl INNER JOIN ItemsDirectory AS ItemsDirectory_1 ON SalesOrderDtl.ItemCode = ItemsDirectory_1.ItemCode INNER JOIN SalesOrderHdr ON SalesOrderDtl.OrderNum = SalesOrderHdr.OrderNum LEFT OUTER JOIN (SELECT  SalesOrderDtl_1.ItemCode, SUM(ItemsInOutL.Qty) AS Issued FROM SalesDtl INNER JOIN ItemsInOutL ON SalesDtl.ID = ItemsInOutL.Trn_ID RIGHT OUTER JOIN SalesOrderDtl AS SalesOrderDtl_1 INNER JOIN SalesOrderHdr AS SalesOrderHdr_1 ON SalesOrderDtl_1.OrderNum = SalesOrderHdr_1.OrderNum ON SalesDtl.Ord_ID = SalesOrderDtl_1.ID WHERE (SalesOrderHdr_1.BranchCode = N'${localStorage.getItem('branchCode')}') AND (SalesOrderHdr_1.CustCode = N'${this.custCode}') GROUP BY SalesOrderDtl_1.ItemCode) AS IssuedTbl ON SalesOrderDtl.ItemCode = IssuedTbl.ItemCode WHERE (ItemsDirectory_1.ItemType = 0) AND (SalesOrderHdr.BranchCode = N'${localStorage.getItem('branchCode')}') AND (SalesOrderHdr.CustCode = N'${this.custCode}') GROUP BY SalesOrderDtl.ItemCode HAVING (SUM(SalesOrderDtl.Qty) - SUM(DISTINCT IssuedTbl.Issued) <> 0)) AS Tbl_BackOrder ON ItemsDirectory.ItemCode = Tbl_BackOrder.ItemCode ON ItemsBrnQtys.ItemCode = ItemsDirectory.ItemCode And ItemsBrnQtys.BranchCode = N'${localStorage.getItem('branchCode')}' WHERE (ItemsDirectory.Salable = 1) AND (ItemsDirectory.Active = 1)`
                    : `SELECT SalQuotationsDtl.ItemCode, ItemsDirectory.ItemName, SalQuotationsDtl.Price, SalQuotationsDtl.Qty, ISNULL(SUM(SalesOrderDtl.Qty),0) AS Ordered, (SalQuotationsDtl.Qty-ISNULL(SUM(SalesOrderDtl.Qty),0)) AS Remain, SalQuotationsDtl.ID FROM SalQuotationsDtl INNER JOIN ItemsDirectory ON SalQuotationsDtl.ItemCode = ItemsDirectory.ItemCode LEFT OUTER JOIN SalesOrderDtl ON SalQuotationsDtl.ID = SalesOrderDtl.Quot_ID WHERE (SalQuotationsDtl.QuotNum = '${this.QuotNum}') GROUP BY SalQuotationsDtl.ItemCode, SalQuotationsDtl.Qty, ItemsDirectory.ItemName, SalQuotationsDtl.Price, SalQuotationsDtl.ID ORDER BY SalQuotationsDtl.ItemCode`;
        
                   
                    
        if (this.gridSalesForm.get('ItemCode').value != '') {                      
          this.isItems = true;
          this.service.LoadPopUpCheck(query, criteria).toPromise()
          .then((res) => { 
            this.data = JSON.parse(<any>res);
            this.itemCodeData = JSON.parse(<any>res);
    
            value = this.gridSalesForm.get('ItemCode').value;
            let itemCode = this.itemCodeData.filter(i => i.ItemCode == value);
            
            if (value != "" && itemCode.length == 0) {
              this.binding.showMessage("validValue");
              this.isValidItemCode = false;
              this.itemCode.nativeElement.focus();
            } else {
              this.gridSalesForm.get('ItemCode').setValue(itemCode[0].ItemCode);
              this.gridSalesForm.get('ItemName').setValue(itemCode[0].ItemName);
    
              (itemCode[0].hasOwnProperty('ID')) 
                ? this.gridSalesForm.get('Quot_ID').setValue(itemCode[0].ID)
                : this.gridSalesForm.get('Quot_ID').setValue('');
    
              if (this.QuotNum != '')  {
                this.gridSalesForm.get('Price').setValue(itemCode[0].Price);
                this.gridSalesForm.get('ListPrice').setValue(itemCode[0].Price)
              } else {
                this.gridSalesForm.get('Price').setValue(itemCode[0][`SalPrice${this.catCode}`]);
                this.gridSalesForm.get('ListPrice').setValue(itemCode[0][`SalPrice${this.catCode}`]);
              }
              
              this.diasableTaxItems(itemCode[0]);

              this.isValidItemCode = true;
            }
            this.isItems = false;
          }).catch(
            err => {
              this.binding.showMessage("validValue");
              this.itemCode.nativeElement.focus();
            }
          )        
        }
        break;                                                            
    }
  }  

  //#endregion
  
  //#region 

  // Mohammed Hamouda - 21/02/2021

  hideGrid(type = 'add') { // hide grid
    this.isShowGrid = false;

    if (type == 'add') {
      this.isAdd = true;
      this.resetGridForm();    
    }

    this.isValidItemCode = false;
  }

  showGrid() {
    this.isShowGrid = true;

    this.invoiceToBeUpdated = {};
    this.allowUpdateInvoic = false;
    this.invoiceObj = {};
    this.InvQty = 0;
    this.SOFQty = 0;
    this.currentOrdered = 0;
    this.currentCancelled = 0;

    this.enableTaxItem();
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

          this.original = this.data;
          this.isVisible = true;
          this.isQuotNum = false;
        }).catch()
      return;
    }

    this.binding.showMessage('noCustomer');

  } 

  getItems() { // get items
    const customer = this.salesOrderForm.get('CustCode').value;

    if (customer == "" || customer == null) {
      this.binding.showMessage('missingCustomer');
      this.customers.nativeElement.focus();
      $('#js_sales_grid_form').removeClass('add-overlay')
    } else {
      const salPriceType = `SalPrice${this.catCode}`;
      const criteria = "";

      const query = (this.QuotNum == '' || this.QuotNum == null) 
                  ? `SELECT ItemsDirectory.ItemCode, ItemsDirectory.ItemName, ItemsDirectory.${salPriceType}, ItemsDirectory.PartNumber, ItemsBrnQtys.OnHndQty, Tbl_BackOrder.BackOrder, ItemsDirectory.Discontinued, TblLastOrderPrice.LastOrderPrice, TblLastOrderPrice.LastOrderDate FROM (SELECT SalesOrderHdr_2.OrderDate AS LastOrderDate, SalesOrderDtl_2.ItemCode, SalesOrderDtl_2.Price AS LastOrderPrice FROM SalesOrderDtl AS SalesOrderDtl_2 INNER JOIN SalesOrderHdr AS SalesOrderHdr_2 ON SalesOrderDtl_2.OrderNum = SalesOrderHdr_2.OrderNum INNER JOIN (SELECT  MAX(SalesOrderHdr_1.OrderNum) AS LastOrderNum, SalesOrderDtl_1.ItemCode FROM SalesOrderDtl AS SalesOrderDtl_1 INNER JOIN SalesOrderHdr AS SalesOrderHdr_1 ON SalesOrderDtl_1.OrderNum = SalesOrderHdr_1.OrderNum WHERE (SalesOrderHdr_1.CustCode = N'${this.custCode}') GROUP BY SalesOrderDtl_1.ItemCode) AS TblLastDate ON SalesOrderDtl_2.ItemCode = TblLastDate.ItemCode AND SalesOrderHdr_2.OrderNum = TblLastDate.LastOrderNum WHERE (SalesOrderHdr_2.CustCode = N'${this.custCode}')) AS TblLastOrderPrice INNER JOIN ItemsBrnQtys ON TblLastOrderPrice.ItemCode = ItemsBrnQtys.ItemCode RIGHT OUTER JOIN ItemsDirectory LEFT OUTER JOIN (SELECT SalesOrderDtl.ItemCode, SUM(SalesOrderDtl.Qty) - SUM(DISTINCT IssuedTbl.Issued) AS BackOrder  FROM SalesOrderDtl INNER JOIN ItemsDirectory AS ItemsDirectory_1 ON SalesOrderDtl.ItemCode = ItemsDirectory_1.ItemCode INNER JOIN SalesOrderHdr ON SalesOrderDtl.OrderNum = SalesOrderHdr.OrderNum LEFT OUTER JOIN (SELECT  SalesOrderDtl_1.ItemCode, SUM(ItemsInOutL.Qty) AS Issued FROM SalesDtl INNER JOIN ItemsInOutL ON SalesDtl.ID = ItemsInOutL.Trn_ID RIGHT OUTER JOIN SalesOrderDtl AS SalesOrderDtl_1 INNER JOIN SalesOrderHdr AS SalesOrderHdr_1 ON SalesOrderDtl_1.OrderNum = SalesOrderHdr_1.OrderNum ON SalesDtl.Ord_ID = SalesOrderDtl_1.ID WHERE (SalesOrderHdr_1.BranchCode = N'${localStorage.getItem('branchCode')}') AND (SalesOrderHdr_1.CustCode = N'${this.custCode}') GROUP BY SalesOrderDtl_1.ItemCode) AS IssuedTbl ON SalesOrderDtl.ItemCode = IssuedTbl.ItemCode WHERE (ItemsDirectory_1.ItemType = 0) AND (SalesOrderHdr.BranchCode = N'${localStorage.getItem('branchCode')}') AND (SalesOrderHdr.CustCode = N'${this.custCode}') GROUP BY SalesOrderDtl.ItemCode HAVING (SUM(SalesOrderDtl.Qty) - SUM(DISTINCT IssuedTbl.Issued) <> 0)) AS Tbl_BackOrder ON ItemsDirectory.ItemCode = Tbl_BackOrder.ItemCode ON ItemsBrnQtys.ItemCode = ItemsDirectory.ItemCode And ItemsBrnQtys.BranchCode = N'${localStorage.getItem('branchCode')}' WHERE (ItemsDirectory.Salable = 1) AND (ItemsDirectory.Active = 1)`
                  : `SELECT SalQuotationsDtl.ItemCode, ItemsDirectory.ItemName, SalQuotationsDtl.Price, SalQuotationsDtl.Qty, ISNULL(SUM(SalesOrderDtl.Qty),0) AS Ordered, (SalQuotationsDtl.Qty-ISNULL(SUM(SalesOrderDtl.Qty),0)) AS Remain, SalQuotationsDtl.ID FROM SalQuotationsDtl INNER JOIN ItemsDirectory ON SalQuotationsDtl.ItemCode = ItemsDirectory.ItemCode LEFT OUTER JOIN SalesOrderDtl ON SalQuotationsDtl.ID = SalesOrderDtl.Quot_ID WHERE (SalQuotationsDtl.QuotNum = '${this.QuotNum}') GROUP BY SalQuotationsDtl.ItemCode, SalQuotationsDtl.Qty, ItemsDirectory.ItemName, SalQuotationsDtl.Price, SalQuotationsDtl.ID ORDER BY SalQuotationsDtl.ItemCode`;
      
                 
      this.isItems = true;
      
      this.service.LoadPopUpCheck(query, criteria).toPromise()
      .then((res) => { 
        this.data = JSON.parse(<any>res);
        this.itemCodeData = JSON.parse(<any>res);

        this.popupType = 'ItemCode';
        this.pouppTitle = 'Items';

        this.original = this.data;
          this.isVisible = true;
        this.isItems = false;
      }).catch()
    }

  }

  //#endregion

  //#region 
  
  // calc operations
  // Mohammed Hamouda - 22/02/2021

  calc(val, type = 'ordered') { // amount
    let quantity = (type == 'ordered') 
      ? parseFloat(this.gridSalesForm.get('CanceledQty').value)
      : parseFloat(this.gridSalesForm.get('OrderedQty').value);

    let qty =  (type == 'ordered') ? parseFloat(val) - quantity : quantity - parseFloat(val);
    let total = qty * parseFloat(this.gridSalesForm.get('Price').value);

    if (isNaN(total))
      total = parseFloat(this.gridSalesForm.get('Price').value);

    //this.salesOrderForm.get('Amount').setValue(total);
    this.gridSalesForm.get('SubTotal').setValue(total);
  }

  vat(type = 'new') { // tax
    const system = JSON.parse(localStorage.getItem('systemVariables'));
    
    let priceBeforeTax = this.calcPriceBeforeTax(this.arrOfItems);

    if (system[0].AutoCalcVAT) {
      if (this.isNewOrUpdate === 1) // do not call auto calc func if user get data
        this.manualCalcVat(this.arrOfItems, system[0].Glb_VAT_ItemCode, priceBeforeTax, type)
      else
        this.autoCalcVat(system[0].Glb_VAT_ItemCode, priceBeforeTax, type)            
    }
    else
      this.manualCalcVat(this.arrOfItems, system[0].Glb_VAT_ItemCode, priceBeforeTax, type)
  }

  calcPriceBeforeTax(items: any[]) {
    let price: any = 0;
    items.forEach(
      val => {
        if (val["ItemCode"].slice(0, 8) != this.system[0].Glb_VAT_ItemCode.slice(0, 8))
          price += parseFloat(val["SubTotal"])
    });
    
    this.salesOrderForm.get('Amount').setValue(parseFloat(price));
    return price;
  }

  manualCalcVat(items: any[], glbVATITemCode, priceBeforeTaxt, type) {
    let vat: any = 0;
    for (let i = 0; i <= items.length - 1; i++) {
      if (items[i]["ItemCode"].slice(0, 8) == glbVATITemCode.slice(0, 8)) {
        vat += parseFloat(items[i]["SubTotal"]);
      }
    }

    this.salesOrderForm.get('VAT').setValue(parseFloat(vat));
    this.salesOrderForm.get('netAmount').setValue(parseFloat(priceBeforeTaxt) + parseFloat(vat));

    this.binding.sendTax([]);
  }

  autoCalcVat(glbVATITemCode, priceBeforeTax, type) {
    let isApplayVat: any;
    let vatDate: any;
    let itemCode: any;
    let itemName: any;
    let ratio: any;
    let vat: any;

    this.service.getDlk(this.custCode).then(
      res => {
        isApplayVat = res[0].IsApplyVAT;
        vatDate = (res[0].IsApplyVAT != "") ? "" : res[0].VAT_EffectiveDate; 

        if (!isApplayVat) {
          vat = 0;

          this.salesOrderForm.get('VAT').setValue(parseFloat(vat));
          this.salesOrderForm.get('netAmount').setValue(parseFloat(priceBeforeTax + vat));
        } else {
          if (vatDate.length == 0)
            vatDate = this.formatDate(this.salesOrderForm.get('OrderDate').value);
  
          this.service.getVATRatio(vatDate, glbVATITemCode).then(
            res => {
              itemCode = res["VAT_ItemCode"];
              itemName = res["VAT_ItemName"];
              ratio = (res["VAT_Ratio"] == "") ? 0 : parseFloat(res["VAT_Ratio"]); 
            
              if (itemCode == "") 
                return;
              
              vat = (priceBeforeTax * ratio) / 100;

              if (type != 'getDataWithNoTax') {
                this.salesOrderForm.get('VAT').setValue(parseFloat(vat));
                this.salesOrderForm.get('netAmount').setValue(parseFloat(priceBeforeTax + vat));
              }

              this.autoTaxObj = {
                QuotNum: "",
                ItemCode: itemCode,
                ItemName: itemName,
                OrderedQty: "1",
                Price: vat.toString(),
                SubTotal: vat.toString(),
                CanceledQty: 0,
                Qty: "1",
                Issued: "",
                Invoiced: "",
                Quot_ID: "",
                ID: "",
                ListPrice: "0",
                Percentage: "0"                
              };

              (type != 'getDataWithNoTax') && this.binding.sendTax(this.autoTaxObj);

              this.canUpdate = true;

            }
          )     
        }
        
      }
    )    
  }

  priceChange(val) { // when user change price
    let total: any = parseFloat(val) * parseFloat(this.gridSalesForm.get('OrderedQty').value);
    let price: any = this.gridSalesForm.get('ListPrice').value;
    let percentage: any = (price == '0') ? 0 :(((price - val) / price) * 100).toFixed(2); 

    if (isNaN(total))
      total = 0;
      
    if (isNaN(percentage))
      percentage = 0;      

    this.gridSalesForm.get('SubTotal').setValue(parseFloat(total));
    this.gridSalesForm.get('Percentage').setValue(parseFloat(percentage));
  }

  //#endregion

  //#region 

  // checks
  // MohammedHamouda - 22/02/2021
  
  checkItemCode() { // item code
    const itemCode = this.gridSalesForm.get('ItemCode').value;

    if (itemCode == "" || itemCode == null) {
      this.binding.showMessage('missingItemCode');
      this.itemCode.nativeElement.focus();
    }
  }

  checkQuantity(val, type = 'ordered') { // quantity
    const invoiced = this.gridSalesForm.get('Invoiced').value;
    const qty = parseFloat(this.gridSalesForm.get('OrderedQty').value) - parseFloat(this.gridSalesForm.get('CanceledQty').value)

    if ((type == 'ordered' || type == 'cancelled') && invoiced == '') {
      if ((val == '' || parseFloat(val) < 0) && type == 'ordered') {
        val = 1;
        this.gridSalesForm.get('OrderedQty').setValue('0');
        this.binding.showMessage('quntity');
        this.calc(1);
     }

     if ((val == '' || parseFloat(val) < 0) && type == 'cancelled') {
        val = 1;
        this.gridSalesForm.get('CanceledQty').setValue('0');
        this.binding.showMessage('cancelled');
        this.calc(1);       
     }
    } else {
      
      // check if current control is ordered or cancelled && do validation
      if (this.InvQty != 0) {
        if (this.InvQty < this.SOFQty) {
          if (this.InvQty > qty) {
            this.showNotification('warning', this.lang.cannotEditQuantity, this.lang.cannotEditQuantityDetails);
            this.gridSalesForm.get('OrderedQty').setValue(this.currentOrdered);
            this.gridSalesForm.get('CanceledQty').setValue(this.currentCancelled);
          } else {
            this.allowUpdateInvoic = true;
            this.checkInvoiced();
          }
        }
      } 

    }
  } 
  
  checkPrice(val) { // price
    if (val == '') {
      this.gridSalesForm.get('Price').setValue('0');
      this.priceChange(0);
    }
  }

  checkInvoic(item) {
    this.service.tblInfo(
      "SalesDtl,SalesOrderDtl",
      "SalesDtl.Qty AS InvQty, SalesOrderDtl.Qty AS SOFQty, SalesOrderDtl.OrderedQty, SalesDtl.Price AS InvPrice, SalesOrderDtl.Price AS SOFPrice, SalesDtl.SaleNum",
      `SalesDtl.Ord_ID = SalesOrderDtl.ID AND SalesDtl.Ord_ID= '${(item.ID != "") ? item.ID : ''}'`,
      "",
      "",
      "",
      "",
      ""    
    ).then(
      res => {
        let result: any = res; 
        this.invoiceObj = res;  

        if (result.length != 0) {
          this.InvQty = result[0].InvQty;
          this.SOFQty = result[0].SOFQty;

          if (result[0].InvQty == result[0].SOFQty) { // InvQty = SOFQty (ALL Qty Invoiced)
            this.showNotification('warning', this.lang.cannotEditInvoiced, this.lang.cannotEditInvoicedDetails);
            this.allowUpdateInvoic = false;

          } else {
            this.setItemToBeUpdatedOnTheGrid(item)
          }
           
        } else {
          this.setItemToBeUpdatedOnTheGrid(item)
        }
      }
    );
  }  

  checkInvoiced() {
    if (this.allowUpdateInvoic) {
      this.modal.confirm({
        nzTitle: this.lang.changeInvoicConfirmTitle,
        nzCancelText: this.lang.cancel,
        nzOkText: this.lang.confirm,
        nzOkType: 'primary',
        nzOnOk: () => {
          this.sendInvoicedMsg();
        },
        nzOnCancel: () => {
          this.gridSalesForm.get('OrderedQty').setValue(this.currentOrdered);
          this.gridSalesForm.get('CanceledQty').setValue(this.currentCancelled);
        },        
        nzClassName: (this.getLang() == 'AR') ? 'lang-ar' : 'lang-en'
      })
    }
  }

  sendInvoicedMsg() {
    this.service.getCurrentDate("MM/dd/yyyy").toPromise()
    .then(res => {        
      let mail = this.drowTableChangeInvoice(this.invoiceObj[0], this.invoiceToBeUpdated, <string>res);      
      this.returnEmail.emit([31, mail]);
    }) 
  }

  //#endregion

  //#region 

  // grid functions
  // Mohammed Hamouda - 23/02/2021

  addToGrid(item: any = {}, type = "new") { // add row to a grid
    // add item to grid
    this.addRow(item);    

    // add item to arr of item
    this.addItemToArr(item);    

    // tax
    this.vat(type);

    // reset form
    this.resetGridForm();    
  }

  addRowByEnter() {
    if (this.isAdd && this.isValidItemCode)
      this.addToGrid();

    if (!this.isAdd && this.gridSalesForm.get('ItemCode').value != '')
      this.editGrid();
  }  

  addRow(item: any = {}) {
    const {Qty, ID, Quot_ID, ...grid} = this.gridSalesForm.getRawValue();

    (Object.keys(item).length > 0) ? this.itemsRecived.push(grid)  : this.gridData = grid;

    if (grid.QuotNum != "" && Object.keys(item).length == 0) 
      this.isCustDisabled = true;
  }

  addItemToArr(item: any = {}) {
    this.i++;    
    const isItem = (Object.keys(item).length > 0) ? true : false;

    const qty = (isItem) ? item.Qty : this.gridSalesForm.get('OrderedQty').value - this.gridSalesForm.get('CanceledQty').value;    

    this.gridSalesForm.get('Qty').setValue(qty);

    const addProp = (!isItem) ? this.gridSalesForm.getRawValue() : item;
    addProp.id = this.i;

    this.arrOfItems = [
      ...this.arrOfItems,
      addProp      
    ];   

     // num of items on grid
     this.header.gridrowlnum = this.arrOfItems.length;

     // remove first object from array 
     (isItem) && this.arrOfItems.unshift();
  }

  resetGridForm() { // reset form
    this.gridSalesForm.reset({
      QuotNum: "",
      ItemCode: "",
      ItemName: "",
      OrderedQty: "1",
      Price: "",
      SubTotal: "",
      CanceledQty: "0",
      Qty: "",
      Issued: "",
      Invoiced: "",
      Quot_ID: "",
      ID: "",
      ListPrice: "",
      Percentage: "0"
    })
  }

  removeFromArrOfItems(id) { // remove item when removed from the grid
    let numberOfQuot: any[] = [];
    this.arrOfItems = this.arrOfItems.filter(i => i.id !== id);

    for (let i = 0; i <= this.arrOfItems.length - 1; i++) {
      if (this.arrOfItems[i].QuotNum != "")
        numberOfQuot.push(1)
      else
        numberOfQuot.push(0)
    }
    

    if (numberOfQuot.includes(1)) 
      this.isCustDisabled = true;
    else 
      this.isCustDisabled = false;
    

    // num of items on grid
    this.header.gridrowlnum = this.arrOfItems.length;
    this.vat();
  }

  setItemToBeUpdatedOnTheGrid(item) {
    this.QuotNum = item.QuotNum;

    this.gridSalesForm.get('QuotNum').setValue(item.QuotNum);
    this.gridSalesForm.get('ItemCode').setValue(item.ItemCode);
    this.gridSalesForm.get('ItemName').setValue(item.ItemName);
    this.gridSalesForm.get('OrderedQty').setValue(item.OrderedQty);
    this.gridSalesForm.get('Price').setValue(item.Price);
    this.gridSalesForm.get('SubTotal').setValue(item.SubTotal);
    this.gridSalesForm.get('CanceledQty').setValue(item.CanceledQty);
    this.gridSalesForm.get('Issued').setValue(item.Issued);
    this.gridSalesForm.get('Invoiced').setValue(item.Invoiced);
    this.gridSalesForm.get('ListPrice').setValue(item.ListPrice);    
    this.gridSalesForm.get('Percentage').setValue(item.Percentage);

    this.gridSalesForm.get('Qty').setValue(item.Qty);
    this.gridSalesForm.get('ID').setValue(item.ID);
    this.gridSalesForm.get('Quot_ID').setValue(item.Quot_ID);

    this.currentOrdered = this.gridSalesForm.get('OrderedQty').value;
    this.currentCancelled = this.gridSalesForm.get('CanceledQty').value;

    this.invoiceToBeUpdated = item;  
    
    this.diasableTaxItems(item)
    
    this.hideGrid('edit');
  }

  editGrid() {
    const {Qty, ID, Quot_ID, ...grid} = this.gridSalesForm.getRawValue();
    const qty = this.gridSalesForm.get('OrderedQty').value - this.gridSalesForm.get('CanceledQty').value;

    this.gridSalesForm.get('Qty').setValue(qty)

    this.arrOfItems[this.indexOfItemToBeUpdated] = this.gridSalesForm.getRawValue();
    this.arrOfItems[this.indexOfItemToBeUpdated].id = this.itemId

    grid.id = this.itemId;
    const updatedItem: any[] = [this.indexOfItemToBeUpdated, grid];    

    this.vat();
    this.resetGridForm();
    this.showGrid();

    this.binding.sendUpdatedItem(updatedItem);
  }

  //#endregion

  //#region

  // return arr to be sent
  // Mohammed Hamouda - 01/03/2021

  getArrToBeSent(data) {
    // add items to array
    let arr: any[] = [];

    // check if this item is a tax item
    let taxItems: any[] = [];


    // remove id prop
    for(let i = 0; i <= this.arrOfItems.length - 1; i++) {
      const {id, ...objWithoutId} = this.arrOfItems[i];

      if (objWithoutId["ItemCode"].slice(0, 8) == this.system[0].Glb_VAT_ItemCode.slice(0, 8))
        taxItems.push(objWithoutId);
      else 
        arr.push(objWithoutId);
    }   

    // add header values
    arr.unshift(data);
    
    // get order num
    this.header.masters = data.OrderNum;
    this.header.gridIndex = Object.keys(data).length;
    this.header.gridrowlnum = this.arrOfItems.length;

    let arrToBeSent: any[] = []
    arrToBeSent.push(this.header);
    arrToBeSent.push(arr);

    // if manual calc tax
    if (taxItems.length > 0) {
      for(let i = 0; i <= taxItems.length - 1; i++)
        arrToBeSent[1].push(taxItems[i])
    }

    // if auto calc tax
    if (Object.keys(this.autoTaxObj).length > 0) {
      // increase number of rows
      let rows = parseInt(this.header.gridrowlnum);
      this.header.gridrowlnum = rows + 1
      arrToBeSent[0] = this.header

      // add taxt object
      arrToBeSent[1].push(this.autoTaxObj)
    }

    return arrToBeSent
  }

  //#endregion

  //#region 

  // items always disabled
  // Mohammed Hamouda - 02/03/2021 

  alwaysDisabledControls() {
    $('#CurrencyName').attr('disabled', 'true');
    $('#Amount').attr('disabled', 'true');
    $('#ChangeRate').attr('disabled', 'true');
    $('#VAT').attr('disabled', 'true');
    $('#netAmount').attr('disabled', 'true');
    $('#Percentage').attr('disabled', 'true');
    $('#ListPrice').attr('disabled', 'true');
    $('#SubTotal').attr('disabled', 'true');

    $('#BranchCode').attr('disabled', 'true');
    $('#ServerCode').attr('disabled', 'true');
    $('#BrnSerial').attr('disabled', 'true');
    
    $('#Description').attr('disabled', 'true');
    $('#Issued').attr('disabled', 'true');
    $('#Invoiced').attr('disabled', 'true');
    $('#ItemName').attr('disabled', 'true');

    this.setAuth();  
  }

  //#endregion

  //#region 

  // disable controles when edit tax
  // Mohammed Hamouda - 07/03/2021

  diasableTaxItems(item) {
    if (item["ItemCode"].slice(0, 8) == this.system[0].Glb_VAT_ItemCode.slice(0, 8)) {
      $('#QuotNum').prop('disabled', true);
      $('#OrderedQty').attr('disabled', 'true');
      $('#CanceledQty').attr('disabled', 'true');

      this.isTax = true;
    } 
  }

  enableTaxItem() {
    $('#QuotNum').removeAttr('disabled');
    $('#OrderedQty').removeAttr('disabled');
    $('#CanceledQty').removeAttr('disabled');

    this.isTax = false;
  }

  //#endregion

  //#region 

  // email
  // Mohammed Hamouda - 03/02/2021

  drowTableModified(original, modified, date) {
    modified[1].shift();
    let modifiedArr = modified[1];
    let originalLength = original.length;

    // check if there are no changes 

    if (modifiedArr.length == originalLength) {
      let comparisonArr: any[] = [];
      for (let i = 0; i <= originalLength - 1; i++) {
        const {id, ...objWithoutId} = original[i];

        (_.isEqual(modifiedArr[i], objWithoutId))
          ? comparisonArr.push(1)
          : comparisonArr.push(0)         
      }

      if (!comparisonArr.includes(0))
        return false;
    }

    let modifiedRequest = `<p>================ Modified SALES ORDER ======================</p><table border=1 style="background-color:#daf4ff; border:1px solid black" bordercolor="#000" cellpadding="5" cellspacing="0"> <br>`;
    modifiedRequest += `<tr><td>Order No</td><td style="${(this.salesOrderForm.get('OrderNum').value != this.originalSalesData['OrderNum']) ? 'color: red;' : 'color: black;'} ${(this.salesOrderForm.get('OrderDate').value != this.originalSalesData['OrderNum']) ? 'font-weight: bold' : 'font-weight: normal'}">${this.salesOrderForm.get('OrderNum').value}</td></tr>`;
    modifiedRequest += `<tr><td>Order Date</td><td style="${(this.formatDate(this.salesOrderForm.get('OrderDate').value) != this.formatDate(this.originalSalesData['OrderDate'])) ? 'color: red;' : 'color: black;'} ${(this.formatDate(this.salesOrderForm.get('OrderDate').value) != this.formatDate(this.originalSalesData['OrderDate'])) ? 'font-weight: bold' : 'font-weight: normal'}">${this.formatDate(this.salesOrderForm.get('OrderDate').value)}</td></tr>`;
    modifiedRequest += `<tr><td>Customer</td><td style="${(this.salesOrderForm.get('PersonName').value != this.originalSalesData['PersonName']) ? 'color: red;' : 'color: black;'} ${(this.salesOrderForm.get('PersonName').value != this.originalSalesData['PersonName']) ? 'font-weight: bold' : 'font-weight: normal'}">${this.salesOrderForm.get('PersonName').value}</td></tr>`;
    modifiedRequest += `<tr><td>Amount</td><td style="${(this.salesOrderForm.get('Amount').value != this.originalSalesData['Amount']) ? 'color: red;' : 'color: black;'} ${(this.salesOrderForm.get('Amount').value != this.originalSalesData['Amount']) ? 'font-weight: bold' : 'font-weight: normal'}">${this.salesOrderForm.get('Amount').value}</td></tr>`;
    modifiedRequest += `<tr><td>Currency Name</td><td style="${(this.salesOrderForm.get('CurrencyName').value != this.originalSalesData['CurrencyName']) ? 'color: red;' : 'color: black;'} ${(this.salesOrderForm.get('CurrencyName').value != this.originalSalesData['CurrencyName']) ? 'font-weight: bold' : 'font-weight: normal'}">${this.salesOrderForm.get('CurrencyName').value}</td></tr>`;
    modifiedRequest += `<tr><td>Term Man</td><td style="${(this.salesOrderForm.get('Terms').value != this.originalSalesData['Terms']) ? 'color: red;' : 'color: black;'} ${(this.salesOrderForm.get('Terms').value != this.originalSalesData['Terms']) ? 'font-weight: bold' : 'font-weight: normal'}">${this.salesOrderForm.get('Terms').value}</td></tr>`;
    modifiedRequest += `<tr><td> Issue</td><td>Created By ${this.originalSalesData['IssuedBy']} ${date}   Modified By : <span style="color:red; font-weight:bold"> ${localStorage.getItem('username')} ${date}</span></td></tr>`;
    modifiedRequest += `</table> <br>`;
    modifiedRequest += `<table  border=1  style="background-color:#daf4ff; border:1px solid #000" bordercolor="#000"  cellpadding="5" cellspacing="0"><tr>`

    for(let i = 0; i <= this.mailKeys.length - 1; i++) {
      modifiedRequest += `<td>${this.mailKeys[i]}</td>`;
    }
    modifiedRequest += '</tr>';

    for(let i = 0; i <= modifiedArr.length - 1; i++) {
      modifiedRequest += '<tr>';

      for (let k = 0; k <= this.mailKeys.length - 1; k++) {
        if (i <= originalLength - 1) {
          modifiedRequest += `<td style="${(modifiedArr[i][this.mailKeys[k].replace(' ', '')] != original[i][this.mailKeys[k].replace(' ', '')]) ? 'color: red;' : 'color: black;'} ${(modifiedArr[i][this.mailKeys[k].replace(' ', '')] != original[i][this.mailKeys[k].replace(' ', '')]) ? 'font-weight: bold' : 'font-weight: normal'}">${modifiedArr[i][this.mailKeys[k].replace(' ', '')]}</td>`;
        } else {
          modifiedRequest += `<td style="color: red; font-weight: bold">${modifiedArr[i][this.mailKeys[k].replace(' ', '')]}</td>`;
        }
      }
      modifiedRequest += '</tr>';
    }
    modifiedRequest += '</table> <br>';

    return modifiedRequest.replace(/&/g, "%26").replace(/#/g, "%23");
  }

  drowTableOriginal(original, date) {
    let originalRequest = `<p>================ ORIGINAL SALES ORDER ======================</p><table border=1 style="background-color:#DAD4EE; border:1px solid black" bordercolor="#000" cellpadding="5" cellspacing="0"> <br>`;
    originalRequest += `<tr><td>Order No</td><td>${this.originalSalesData['OrderNum']}</td></tr>`;
    originalRequest += `<tr><td>Order Date</td><td>${this.formatDate(this.originalSalesData['OrderDate'])}</td></tr>`;
    originalRequest += `<tr><td>Customer</td><td>${this.originalSalesData["PersonName"]}</td></tr>`;
    originalRequest += `<tr><td>Amount</td><td>${this.originalSalesData["Amount"]}</td></tr>`;
    originalRequest += `<tr><td>Currency Name</td><td>${this.originalSalesData['CurrencyName']}</td></tr>`;
    originalRequest += `<tr><td>Term Man</td><td>${this.originalSalesData["Terms"]}</td></tr>`;
    originalRequest += `<tr><td> Issue</td><td>Created By ${this.originalSalesData['IssuedBy']} ${date}   Modified By : <span> ${localStorage.getItem('username')} ${date}</span></td></tr>`;
    originalRequest += `</table> <br>`;
    originalRequest += `<table  border=1  style="background-color:#DAD4EE; border:1px solid #000" bordercolor="#000"  cellpadding="5" cellspacing="0"><tr>`
    
    for(let i = 0; i <= this.mailKeys.length - 1; i++) {
      originalRequest += `<td>${this.mailKeys[i]}</td>`;
    }
    originalRequest += '</tr>';

    for(let i = 0; i <= original.length - 1; i++) {
      originalRequest += '<tr>';

      for (let k = 0; k <= this.mailKeys.length - 1; k++) {
        originalRequest += `<td>${original[i][this.mailKeys[k].replace(' ', '')]}</td>`;
      }
      originalRequest += '</tr>';
    }
    originalRequest += '</table> <br>';

    return originalRequest.replace(/&/g, "%26").replace(/#/g, "%23");
  }

  drowTableChangeInvoice(invoicObj, item, date) {
    let invoicRequest = `<table border=1  style="background-color:#daf4ff;border:1px solid black" bordercolor="black"  cellpadding="5" cellspacing="0">`
    let color;

    invoicRequest += '<tr>'

    for (let i = 0; i <= this.invoicKeys.length - 1; i++) {
      invoicRequest += `<td>${this.invoicKeys[i]}</td>`;
    }
    invoicRequest += '</tr>';

    if (invoicObj.InvQty != this.gridSalesForm.get('OrderedQty').value) { 

      invoicRequest += '<tr>';
      for (let i = 0; i <= this.invoicKeys.length - 1; i++) {
        (this.gridSalesForm.get(this.invoicKeys[i]).value != item[this.invoicKeys[i]])
          ? color = 'red'
          : color = 'black';

        (this.invoicKeys[i] == 'Invoiced')
          ? invoicRequest += `<td style="color:${color}">${this.gridSalesForm.get('Invoiced').value}</td>`
          : invoicRequest += `<td style="color:${color}">${this.gridSalesForm.get(this.invoicKeys[i]).value}</td>`;
      }
      invoicRequest += '</tr>';

    } else {
      invoicRequest += '<tr>';
      for (let i = 0; i <= this.invoicKeys.length - 1; i++) {
        (this.gridSalesForm.get(this.invoicKeys[i]).value != item[this.invoicKeys[i]])
          ? color = 'red'
          : color = 'black';

        (this.invoicKeys[i] == 'Invoiced')
          ? invoicRequest += `<td style="color:${color}">${this.gridSalesForm.get('Invoiced').value}</td>`
          : invoicRequest += `<td style="color:${color}">${this.gridSalesForm.get(this.invoicKeys[i]).value}</td>`;
      }
      invoicRequest += '</tr>';
    }

    invoicRequest += `<tr><td>Issue</td><td colspan="6"> Modified By <font ><b>${localStorage.getItem('username')} ${date}</b></font></td></tr>`
    invoicRequest += '</table> <br>';

    return invoicRequest.replace(/&/g, "%26").replace(/#/g, "%23");
  } 

  //#endregion

  //#region 

  // stop calling filpup function when click enter
  // Mohammed Hamouda - 02/03/2021

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      return
    }
  }

  @HostListener('window:keyup', ['$event'])
  onEsc(event) { // show grid
    if (event.keyCode == 27 ) {
      this.isShowGrid = true;
    }
  }   

  //#endregion

  //#region 

  // add and update functions
  // Mohammed Hamouda => 08/03/2021

  addWithValidation(data, branchCode, serverCode) {
    let num;
    this.service.getMaxNumOfRecords("SalesOrderHdr", "BrnSerial", `BranchCode='${branchCode}'`).toPromise()
    .then(res => {
      num = res;
      this.salesOrderForm.get('BrnSerial').setValue(num + 1);

      data.OrderNum = `${branchCode}${serverCode}${num + 1}`;                               
      data.BrnSerial = num + 1;               
      
      // check posting
      this.service.checkPosting('OrderNum', data.OrderNum, 'SAL', data.OrderDate, 'SalesOrderHdr', branchCode)
        .then(                    
          res => {                      
            let obj: any = res;
            let title = (this.getLang() == "EN") ? "Invalid Date" : "تاريخ غير صالح"
            let msg = (this.getLang() == "EN") ? obj.latin : obj.arabic;

            if (typeof(res) == 'object') {
              this.returnData.emit([]) 
            } else {
              this.isNewOrderAdded = true;
              this.salesOrderForm.get('OrderNum').setValue(data.OrderNum)
              this.returnData.emit(this.getArrToBeSent(data)); 
            }
              
            (typeof(res) == 'object') && this.showNotification('warning', title, msg);
          }
        )              
      
    })
    .catch(err => this.showNotification("err", this.lang.genericErrMsgTitle, err));      
  }

  updateWithValidation(data, branchCode) {
    let priceBeforeTax = this.calcPriceBeforeTax(this.arrOfItems);

    this.service.getCurrentDate("MM/dd/yyyy").toPromise()
    .then(res => {
      if (this.system[0].AutoCalcVAT) {
        let isHaveTax = this.arrOfItems.filter(i => i["ItemCode"].slice(0, 8) == this.system[0].Glb_VAT_ItemCode.slice(0, 8))
        if(!this.drowTableModified(this.itemsRecivedWitoutFilter, this.getArrToBeSent(data), this.formatDate(<string>res))) {
          this.returnData.emit([]);
        } else {
          if (isHaveTax.length == 0) // do not call auto calc func if user get data
            this.autoCalcVat(this.system[0].Glb_VAT_ItemCode, priceBeforeTax, 'new');
          else
            this.canUpdate = true;
        }
      } else {
        this.canUpdate = true;
      }
    })

    const canUpdate = setInterval(() => {
      if (this.canUpdate) {
        clearInterval(canUpdate);
        // check posting
        this.service.checkPosting('OrderNum', data.OrderNum, 'SAL', data.OrderDate, 'SalesOrderHdr', branchCode)
          .then(                    
            res => {                      
              let obj: any = res;
              let title = (this.getLang() == "EN") ? "Invalid Date" : "تاريخ غير صالح"
              let msg = (this.getLang() == "EN") ? obj.latin : obj.arabic;
    
              if (typeof(res) == 'object') {
                this.returnData.emit([]);
                this.showNotification('warning', title, msg);
              } else {
                this.service.getCurrentDate("MM/dd/yyyy").toPromise()
                .then(res => {
                  if(!this.drowTableModified(this.itemsRecivedWitoutFilter, this.getArrToBeSent(data), this.formatDate(<string>res))) {
                    this.returnData.emit([]);
                  } else {
                    let mail = this.drowTableModified(this.itemsRecivedWitoutFilter, this.getArrToBeSent(data), this.formatDate(<string>res)) + this.drowTableOriginal(this.itemsRecivedWitoutFilter, this.formatDate(<string>res))
                    this.returnData.emit(this.getArrToBeSent(data));
                    this.returnEmail.emit([29, mail]);              
                  }
                })            
              }
            }
          )     
      }
    }, 100)

  }

  //#endregion

  //#region 

  // sort
  // Mohammed Hamouda - 14/03/2021

  sotrHandler(event) {
    this.data = event;
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
          if (this.isNewOrderAdded) { // load data from DB after adding new order so that ID can be existed
            let cri = `SalesOrderHdr.OrderNum = '${this.salesOrderForm.get('OrderNum').value}'`;
            this.service.loadData(localStorage.getItem('sqlStm'), cri).subscribe(
              res => {
                this.displayData(res);
                this.isNewOrderAdded = false;
                clearInterval(isReset);
                return;
              }
            )
          }
          this.i = 0;          
          this.isApproved = '0';
          this.deliveryOrder = '1';
          this.gridData = [];
          this.arrOfItems = [];
          this.itemsRecivedWitoutFilter = [];
          this.taxArr = [];
          this.isCompleted = false;
          this.binding.sendOrderStatus(['new order', 'inProgress']); 

          this.invoiceToBeUpdated = {};
          this.allowUpdateInvoic = false;
          this.invoiceObj = {};
          this.InvQty = 0;
          this.SOFQty = 0;
          this.currentOrdered = 0;
          this.currentCancelled = 0;          

          this.salesOrderForm.enable();
          this.salesOrderFormGenerator();
          
          this.gridSalesForm.enable();
          this.resetGridForm();

          this.alwaysDisabledControls();
          this.getCurrentDate();

          this.setDefaultValues();

          $('#CustCode').removeAttr('disabled');
          this.isCustDisabled = false;
          this.custCode = '';
          this.customerCode = '';
          this.personName = '';
          this.isNewOrUpdate = 0;
          this.isValidItemCode = false;
          this.canUpdate = false;
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
          let data = this.salesOrderForm.getRawValue();
          
          // mail & emit
          this.service.getCurrentDate("MM/dd/yyyy").toPromise()
          .then(res => {
            let mail = this.drowTableOriginal(this.itemsRecivedWitoutFilter, this.formatDate(<string>res));
            this.returnData.emit(this.getArrToBeSent(data));           
            this.returnEmail.emit([28, mail]);
            clearInterval(isDelete);
          })           
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
            let allData: any[] = [];

            let OrderNum = this.salesOrderForm.get('OrderNum').value; 
            let data = this.salesOrderForm.getRawValue();

            let orderDate = new Date(this.salesOrderForm.get('OrderDate').value);
            let deliveryDate = new Date(this.salesOrderForm.get('DeliveryDate').value);
            let approvedDate = new Date(this.salesOrderForm.get('ApprovedDate').value);

            let branchCode = localStorage.getItem('branchCode');
            let serverCode = localStorage.getItem('branchCode'); 

            // sql date
            data.OrderDate = this.formatDate(orderDate);
            data.DeliveryDate = this.formatDate(deliveryDate);
            data.ApprovedDate = (typeof(approvedDate) == 'undefined') ? '' : this.formatDate(approvedDate);
            
            // adjust values
            (data.Canceled) ? data.Canceled = 1 : data.Canceled = 0;

            // check date
            if (data.OrderDate > data.DeliveryDate) {
              this.returnData.emit([]);
              this.showNotification('warning', this.lang.warningInValidDateTitle, this.lang.inValidDateMsgDetails);
              clearInterval(isSaveOrUpdate);
              return;
            }

            // check amount
            if (parseFloat(data.Amount) == 0 || data.Amount == '') {              
              this.showNotification('warning', this.lang.warningGenericMsgTitle, this.lang.missingAmountDetails);
              this.returnData.emit([]);
              clearInterval(isSaveOrUpdate);
              return;
            } 
            
            // check cridet for
            if (!this.auth.ChangeTerms) {
              let creditObj = this.termsData.filter(t => t.Terms == data.Terms);
              if (this.creditFor < creditObj[0]['CreditFor']) {
                this.showNotification('warning', this.lang.creditForMsgTitle, this.lang.creditForDetails);
                this.returnData.emit([]);
                clearInterval(isSaveOrUpdate);
                return;                
              }
            }

            if (OrderNum == null || OrderNum == '') { // if new
              if (data.PurOrder = "") {
                this.addWithValidation(data, branchCode, serverCode); 
                clearInterval(isSaveOrUpdate);
                return;
              } else {
                let con = (this.customerCode == '') ? "" : `AND OrderNum <> '${data.OrderNum}' AND CustCode  = ${data.CustCode}`; 
                this.service.checkIfUsed('SalesOrderHdr', 'PurOrder', `PurOrder= '${data.PurOrder}' ${con}`).toPromise()
                  .then(
                    res => {
                      if (res > 0) {
                        this.showNotification('warning', this.lang.purOrderMsgTitle, this.lang.purOrderMsgDetails)
                        clearInterval(isSaveOrUpdate);
                        return;
                      } else {
                        this.addWithValidation(data, branchCode, serverCode);
                        clearInterval(isSaveOrUpdate);
                        return;
                      }
                    }
                  )
              }     
            } else { // if update

              // check customer code
              if (this.customerCode != this.salesOrderForm.get('CustCode').value) {
                if (data.PurOrder = "") {
                  this.service.checkIfUsed('SalesHdr', 'SaleNum', `OrderNum= '${data.OrderNum}'`).toPromise()
                  .then(
                    res => {
                      if (res > 0) {
                        this.returnData.emit([]);
                        this.gridSalesForm.get('CustCode').setValue(this.customerCode);
                        this.gridSalesForm.get('PersonName').setValue(this.personName);
                        this.showNotification('warning', this.lang.custMsgTitle, this.lang.custMsgDetails);
                        clearInterval(isSaveOrUpdate);
                        return;
                      } else {
                        this.updateWithValidation(data, branchCode);
                        clearInterval(isSaveOrUpdate);
                        return;
                      }
                    }
                  )
                } else {
                  let con = (this.customerCode == '') ? "" : `AND OrderNum <> '${data.OrderNum}' AND CustCode  = ${data.CustCode}`; 
                  this.service.checkIfUsed('SalesOrderHdr', 'PurOrder', `PurOrder= '${data.PurOrder}' ${con}`).toPromise()
                    .then(
                      res => {
                        if (res > 0) {
                          this.showNotification('warning', this.lang.purOrderMsgTitle, this.lang.purOrderMsgDetails)
                        } else {
                          this.service.checkIfUsed('SalesHdr', 'SaleNum', `OrderNum= '${data.OrderNum}'`).toPromise()
                            .then(
                              res => {
                                if (res > 0) {
                                  this.returnData.emit([]);
                                  this.gridSalesForm.get('CustCode').setValue(this.customerCode);
                                  this.gridSalesForm.get('PersonName').setValue(this.personName);
                                  this.showNotification('warning', this.lang.custMsgTitle, this.lang.custMsgDetails);
                                  clearInterval(isSaveOrUpdate);
                                  return;
                                } else {
                                  this.updateWithValidation(data, branchCode);
                                  clearInterval(isSaveOrUpdate);
                                  return;
                                }
                              }
                            )
                        }
                      }
                    )
                } 
              } else {
                this.updateWithValidation(data, branchCode);
                clearInterval(isSaveOrUpdate);
                return;
              }                                     
            }
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

        if (this.isRefresh && this.isNewOrUpdate == 1) {
          this.orderItems(this.salesOrderForm.get('OrderNum').value);          
        }

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
          this.returnID.emit(this.salesOrderForm.get('OrderNum').value);
        }

        clearInterval(isReporting);
      }
    }, 100);     
  }   

}
