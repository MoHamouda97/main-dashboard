import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DatabindingService } from 'src/services/databinding.service';
import { FrmService } from 'src/services/frm/frm.service';
import * as lang from './../../../../../settings/lang';
import * as _ from 'lodash';

@Component({
  selector: 'app-vouchers',
  templateUrl: './vouchers.component.html',
  styleUrls: ['./vouchers.component.css']
})
export class VouchersComponent implements OnInit, OnChanges {
  // extchange data between parent and child
  @Input('data') data = [];
  @Input('objID') objID = 9;
  @Input('isReset') isReset = false;
  @Input('isDelete') isDelete = false;
  @Input('isSaveOrUpdate') isSaveOrUpdate = false;
  @Input('isRefresh') isRefresh = false;
  @Input('isReporting') isReporting = false;
  @Output('returnData') returnData : EventEmitter<any> = new EventEmitter();
  @Output('returnID') returnID : EventEmitter<any> = new EventEmitter();
  @Output('returnEmail') returnEmail: EventEmitter<any> = new EventEmitter();

  // for track validatable values  
  @ViewChild('customers_vendors', {static: true}) customers_vendors: ElementRef; 
  @ViewChild('TransCode', {static: true}) TransCode: ElementRef; 
  @ViewChild('store', {static: true}) store: ElementRef; 
  @ViewChild('costCenter', {static: true}) costCenter: ElementRef; 
  @ViewChild('branches', {static: true}) branches: ElementRef;
  @ViewChild('delivery', {static: true}) delivery: ElementRef;
  @ViewChild('items', {static: true}) items: ElementRef; 
  @ViewChild('MTN_control', {static: false}) MTN_control: ElementRef; 
  @ViewChild('target_store', {static: true}) target_store: ElementRef;
  @ViewChild('onLoanItem', {static: false}) onLoanItem: ElementRef;  

  // form var
  voucherForm: FormGroup;
  gridVoucherForm: FormGroup; 
  creatingMRNForm: FormGroup;
  onLoanForm: FormGroup;

  // show hide form
  isShowForm: boolean = true;

  // loader
  isLoading: boolean = true;  

  // system
  system = JSON.parse(localStorage.getItem('systemVariables'));   

  // language
  lang: any; 
  
  // sql statments
  queries: any[] = [
    `SELECT PersonCode,PersonName From Persons WHERE (BranchCode='${localStorage.getItem("branchCode")}') AND (PersonType=1 or PersonType=2)`, // customers
    `Select StoreName,StoreCode From Stores WHERE (BranchCode='${localStorage.getItem("branchCode")}')`, // stors
    "select * from SalDeliveryMethods", // delivery methods
    "SELECT BranchName, BranchCode FROM BranchCodes", // branch name
    "Select CenterName, CenterCode From CostCenters", // cost centers
    `Select TransCode,TransName,TransType,System From InvTransTypes WHERE TransType='${(this.objID == 9 ? -1 : 1)}'`,
    `SELECT ItemsInOutL.ItemCode, ItemsDirectory.ItemName, ItemsInOutL.Qty, ItemsInOutL.Trn_ID, ItemsInOutL.Price, ItemsInOutL.ID, ItemsInOutL.StoreCode, ItemsInOutL.Cost FROM ItemsInOutL INNER JOIN ItemsDirectory ON ItemsInOutL.ItemCode = ItemsDirectory.ItemCode ORDER BY ItemsInOutL.ItemCode`,
    `SELECT Items.ItemCode, ItemsDirectory.ItemName, ItemsDirectory.PartNumber, ItemsBrnQtys.OnHndQty, Items.Location FROM Items INNER JOIN ItemsDirectory ON Items.ItemCode = ItemsDirectory.ItemCode LEFT OUTER JOIN ItemsBrnQtys ON Items.ItemCode = ItemsBrnQtys.ItemCode AND Items.BranchCode = ItemsBrnQtys.BranchCode WHERE Items.BranchCode='${localStorage.getItem('branchCode')}' ORDER By Items.ItemCode`,
    "SELECT StoreCode, StoreName From Stores WHERE BranchCode='" + this.system[0].ServerCode + "'", // target store
    "SELECT ItemCode, ItemName, ItemType FROM ItemsDirectory  WHERE (Cat1Code = N'01') AND (Discontinued = 0) AND (ItemType = 0)" // on loan query
  ];
  
  // popup data
  popupData: any = [];
  tblData: any = [];
  original: any = [];
  popupType: string = '';
  pouppTitle: string = '';
  customersData: any = [];
  storesData: any = [];
  deliveryMethodsData: any = [];
  branchesData: any = [];
  costCentersData: any = [];
  transTypeData: any = [];
  itemsData: any = [];
  mtnData: any = [];
  targetStoreData: any = [];
  onLoanData: any = []
  
  // add item
  i: number = 0;
  arrOfItems: any[] = [];

  // index of item to be updated
  indexOfItemToBeUpdated: number;
  
  // items recived from DB
  itemsRecived: any [] = [];
  itemsRecivedWitoutFilter: any[] = []; 

  // for disable
  isValidItemCode: boolean = false;
  isValidQuantity: boolean = false;
  isMTN: boolean = false;
  isMRN: boolean = false;
  isCreateMRN: boolean = false;
  isOnLoan: boolean = false;
  isVisible: boolean = false;
  isCareteMRNVisible: boolean = false;
  isOnLoanItem: boolean = false;
  isValidStroe: boolean = false;

  // for visability
  isAdd: boolean = true;
  isShowGrid: boolean = true;

  // grid data
  gridData: any = {};

  // header
  header: any = {
    gridIndex : "",
    childs: "Serial",
    masters: "",
    keycols: 5,
    gridcolnum: 8,
    gridrowlnum: 0,
    m_IDCol: "VCH;5;0",
    gridTableName: "ItemsInOutL",
    beforeCommitObject: ""
  } 
  
  // form type
  TransType: any;

  // check add or update
  isNewRecord: boolean = false;

  // when user get data
  isDisplayData: boolean = false;
  originalDataRecived: any = {};

  // display mrns
  mrns: string = '';

  // loader
  isCreatingMRN: boolean = false;
  isRowLoader = false;

  // item qty
  currentQty: number = 0;
  currentPrice: number = 0;
  inOrOutQty: number = 0;
  trnID: string = '';
  
  // trans num var
  transNumQuery: string = '';
  sourceDoc: string = '';

  // before commit vars
  oldTcode: string = '';
  mode: string = 'add';
  dateIsAdvanced: boolean = false;  
  dateIsRetarded: boolean = false;

  constructor(
    private service: FrmService, 
    private binding: DatabindingService,
    private notification: NzNotificationService,  
    private modal: NzModalService,
    private fb: FormBuilder) { }

  ngOnInit() {
    // generate forms
    this.voucherFormGenerator();
    this.gridVoucherFormGenerator();
    this.creatingMRNFormGenerator();
    this.onLoanFormGenerator();

    // responding to language change
    this.binding.checkIsLangChanged.subscribe(
      res => {
        if (res != null) {
          this.lang = (res == 'EN') ? lang.en : lang.ar;
        }              
      }
    );

    this.lang = (localStorage.getItem('lang') == 'EN') ? lang.en : lang.ar;

    // check item to be updated
    this.binding.checkItemUpdate.subscribe(
      res => {
        if (res != null) {                
          this.addValuesToForm(this.arrOfItems[res]);
          this.getIssoueOrReceive(res, this.arrOfItems[res]['Trn_ID']);                          
          this.indexOfItemToBeUpdated = res;
          this.isAdd = false;
          this.isShowGrid = false;
        }
      }
    );
    
    // check removing item from grid
    this.binding.checkItemRemoved.subscribe(
      res => {
        if (res != null) {
          this.arrOfItems = this.arrOfItems.filter(i => i.id !== res);
          this.header.gridrowlnum = this.arrOfItems.length;
          this.isAdd = true;
          this.isShowGrid = true;  
          this.resetGridForm();        
        }
      }
    );    

    // get date
    this.getCurrentDate();
  }

  //#region 

  getIssoueOrReceive(index, id) {
    let tCode = this.voucherForm.get('TransCode').value;
    let tNum = this.voucherForm.get('TransNum').value;
    let TBDtl = '';
    let FldName = '';
    let query;

    switch (tCode) {
      case "SAL": TBDtl = "SalesDtl"; FldName = "SaleNum";break;
      case "CRET": TBDtl = "SalesReturnDtl"; FldName = "RetNum";break;
      case "PUR": TBDtl = "PurchaseDtl"; FldName = "PurNum";break;
      case "VRET": TBDtl = "PurchaseReturnDtl"; FldName = "RetNum";break;
      case "VORD": TBDtl = "ServiceOrderDtl"; FldName = "OrderNum";break;
    }

    if (TBDtl != '') {
      query = "SELECT * FROM (SELECT  top 100 " + TBDtl + ".ItemCode, ItemsDirectory.ItemName, " + TBDtl + ".Qty, SUM(ItemsInOutL.Qty) AS " + (this.TransType == 1 ? "Received" : "Issued") + ", " + TBDtl + ".ID as ID, " + (tCode == "VORD" ? "0 AS Price" : TBDtl + ".Price As Price") + ", ItemsDirectory.PartNumber, Items.Location FROM " + TBDtl + " INNER JOIN ItemsDirectory ON " + TBDtl + ".ItemCode = ItemsDirectory.ItemCode  INNER JOIN Items ON " + TBDtl + ".ItemCode=Items.ItemCode LEFT OUTER JOIN ItemsInOutL ON " + TBDtl + ".ID = ItemsInOutL.Trn_ID WHERE ((" + TBDtl + "." + FldName + " = '" + tNum + "') AND (ItemsDirectory.ItemType = 0) AND (Items.BranchCode='" + localStorage.getItem('branchCode') + "')) GROUP BY " + TBDtl + ".ItemCode, " + TBDtl + ".Qty, ItemsDirectory.ItemName, " + TBDtl + ".ID, " + (tCode == "VORD" ? "" : TBDtl + ".Price,") + " ItemsDirectory.PartNumber, Items.Location ORDER BY " + TBDtl + ".ItemCode) as tbl WHERE tbl.ID ='"+  id +"'"
      this.service.getcriteriasss(query).toPromise()
        .then(
          res => {
            let data: any = res;

            let inOrOutQty = this.TransType == 1 ? "Received" : "Issued"; 
            this.trnID = id;
            this.currentQty = data[0]['Qty']; 
            this.inOrOutQty = (data[0][inOrOutQty] == null || data[0][inOrOutQty] == '') ? 0 : parseFloat(data[0][inOrOutQty]);
          }
        )
    }    
  }  

  //#endregion

  //#region 

    // form generatot
    // Mohammed Hamouda - 15/03/2021

    voucherFormGenerator() {
      this.voucherForm = this.fb.group({
        BatchNo: [""],
        BranchCode: [localStorage.getItem("branchCode")],
        BranchName: [""],
        CenterCode: [""],
        CenterName: [""],
        ChangeRate: ["1"],
        CurrencyCode: ["001"],
        DeliveredBy: [""],
        DestBranchCode: [localStorage.getItem("branchCode")],
        DocNum: [""],
        IsPosted: ["0"],
        IssuedBy: [localStorage.getItem("username")],
        MTN: [""],
        ModifiedBy: [""],
        Notes: [""],
        PersonCode: [""],
        PersonName: [""],
        ReceivedBy: [""],
        Serial: [""],
        ServerCode: [localStorage.getItem("branchCode")],
        StoreCode: [""],
        StoreName: [""],
        TAmount: [""],
        TContactCode: [""],
        TIsCredit: [""],
        TTerms: [""],
        TTotCommission: [""],
        TransCode: [""],
        TransDate: [""],
        TransName: [""],
        TransNum: [""],
        TransType: [""],
        frmType: [""]
      });
    }

    resetVoucherForm() {
      this.voucherForm.reset({
        BatchNo: "",
        BranchCode: {value: localStorage.getItem("branchCode"), disabled: true},
        BranchName: '',
        CenterCode: '',
        CenterName: '',
        ChangeRate: '1',
        CurrencyCode: '001',
        DeliveredBy: '',
        DestBranchCode: localStorage.getItem("branchCode"),
        DocNum: '',
        IsPosted: '0',
        IssuedBy: localStorage.getItem("username"),
        MTN: '',
        ModifiedBy: '',
        Notes: '',
        PersonCode: '',
        PersonName: '',
        ReceivedBy: '',
        Serial: '',
        ServerCode: {value: localStorage.getItem("branchCode"), disabled: true},
        StoreCode: '',
        StoreName: '',
        TAmount: '',
        TContactCode: '',
        TIsCredit: '',
        TTerms: '',
        TTotCommission: '',
        TransCode: '',
        TransDate: '',
        TransName: '',
        TransNum: '',
        TransType: '', 
        frmType: {value: '', disabled: true}       
      });

      (this.objID == 9) ? this.voucherForm.get('frmType').setValue('i') : this.voucherForm.get('frmType').setValue('r');
    }

    onLoanFormGenerator() {      
      this.onLoanForm = this.fb.group({
        ItemCode: [""],
        ItemName: [""],
        Qty: ['']
      });      
    }

    gridVoucherFormGenerator() {
      this.gridVoucherForm = this.fb.group({
        ItemCode: [""],
        ItemName: {value: '', disabled: true},
        Qty: [""],
        Trn_ID: [""],
        Price: ["0"],
        ID: [""],
        StoreCode: [""],
        Cost: ["0"],
      });
    }

    addValuesToForm(item) {
      this.gridVoucherForm.get('Cost').setValue(item['Cost']);
      this.gridVoucherForm.get('ItemCode').setValue(item['ItemCode']);
      this.gridVoucherForm.get('ItemName').setValue(item['ItemName']);
      this.gridVoucherForm.get('Qty').setValue(item['Qty']);
      this.gridVoucherForm.get('ID').setValue(item['ID']);
      this.gridVoucherForm.get('Price').setValue(item['Price']);
      this.gridVoucherForm.get('StoreCode').setValue(item['StoreCode']);
      this.gridVoucherForm.get('Trn_ID').setValue(item['Trn_ID']);
    }

    resetGridForm() { // reset form    
      this.gridVoucherForm.reset({
        ItemCode: '',
        ItemName: {value: '', disabled: true},
        Qty: '',
        Trn_ID: '',
        Price: '0',
        StoreCode: '',
        ID: '',
        Cost: '0',
      })
    } 

    resetOnLoanForm() {
      this.onLoanForm.reset({
        ItemCode: '',
        ItemName: '',
        Qty: ''
      });
    }
    
    creatingMRNFormGenerator() {
      this.creatingMRNForm = this.fb.group({
        storeCode: [""],
        storeName: {value: '', disabled: true},
      });      
    }

    resetCreatingMRNForm() {
      this.creatingMRNForm.reset({
        storeCode: '',
        storeName: {value: '', disabled: true},
      });

      this.isValidStroe = false;
    }

  //#endregion

  //#region 

    // get current date
    getCurrentDate() { // get server date
      this.service.getCurrentDate("MM/dd/yyyy").toPromise()
        .then(res => {
          this.voucherForm.get('TransDate').setValue(<string>res);
        })
        .catch(err => this.showNotification("err", this.lang.genericErrMsgTitle, err));
    } 
    
    formatDate(date) {
      let d = new Date(date),
          month = '' + (d.getMonth() + 1), 
          day = '' + d.getDate(),
          year = d.getFullYear();
        
      if (month.length < 2)
        month = '0' + month;
      if (day.length < 2) 
        day = '0' + day;

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
      this.service.getcriteriasss(this.queries[3]).toPromise(),
      this.service.getcriteriasss(this.queries[4]).toPromise(),
      this.service.getcriteriasss(`Select TransCode,TransName,TransType,System From InvTransTypes WHERE TransType='${(this.objID == 9 ? -1 : 1)}'`,).toPromise(),
      this.service.getcriteriasss(this.queries[7]).toPromise(),
      this.service.getcriteriasss(this.queries[8]).toPromise(),
      this.service.getcriteriasss(this.queries[9]).toPromise()])
      .then(res => {
        this.customersData = <any>res[0];
        this.storesData = <any>res[1];
        this.deliveryMethodsData = <any>res[2];
        this.branchesData = <any>res[3];
        this.costCentersData = <any>res[4];
        this.transTypeData = <any>res[5];
        this.itemsData = <any>res[6];
        this.targetStoreData = <any>res[7];
        this.onLoanData = <any>res[8];

        // set default values for order
        this.setDefaultValues();

        this.isLoading = false;

      })
      .catch(err => {
        this.showNotification('error', this.lang.genericErrMsgTitle, this.lang.genericErrMsgDetails)
      })
  } 

  setDefaultValues() { // set default values 
    let store = this.storesData.filter(s => s.StoreCode === this.system[1]["DefStoreCode"]);

    if (store.length > 0) {
      this.voucherForm.get('StoreName').setValue(store[0]['StoreName']);
      this.voucherForm.get('StoreCode').setValue(store[0]['StoreCode']);
    } else {
      this.voucherForm.get('StoreName').setValue(this.storesData[0]['StoreName']);
      this.voucherForm.get('StoreCode').setValue(this.storesData[0]['StoreCode']);      
    } 
    
    let branch = this.branchesData.filter(b => b.BranchName == this.system[1]["Glb_Branch_Name"]);

    if (branch.length > 0) {
      this.voucherForm.get('BranchName').setValue(branch[0]['BranchName']);
      this.voucherForm.get('BranchCode').setValue(branch[0]['BranchCode']);
    } else {
      this.voucherForm.get('BranchName').setValue(this.branchesData[0]['BranchName']); 
      this.voucherForm.get('BranchCode').setValue(this.branchesData[0]['BranchCode']);           
    }     
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
      let branch = localStorage.getItem('branchCode');
      let frmType = 'i';
      let serial = data[0]['Serial'];

      this.i = 0;
      this.originalDataRecived = data[0];      

      this.voucherForm.get('BatchNo').setValue(data[0]['BatchNo']);
      this.voucherForm.get('BranchCode').setValue(data[0]['BranchCode']);
      this.voucherForm.get('BranchName').setValue(data[0]['BranchName']);
      this.voucherForm.get('CenterCode').setValue(data[0]['CenterCode']);
      this.voucherForm.get('CenterName').setValue(data[0]['CenterName']);
      this.voucherForm.get('ChangeRate').setValue(data[0]['ChangeRate']);
      this.voucherForm.get('DeliveredBy').setValue(data[0]['DeliveredBy']);
      this.voucherForm.get('DestBranchCode').setValue(data[0]['DestBranchCode']);
      this.voucherForm.get('DocNum').setValue(data[0]['DocNum']);
      this.voucherForm.get('IsPosted').setValue(data[0]['IsPosted']);
      this.voucherForm.get('IssuedBy').setValue(data[0]['IssuedBy']);
      this.voucherForm.get('MTN').setValue(data[0]['MTN']);
      this.voucherForm.get('ModifiedBy').setValue(data[0]['ModifiedBy']);
      this.voucherForm.get('Notes').setValue(data[0]['Notes']);
      this.voucherForm.get('PersonCode').setValue(data[0]['PersonCode']);
      this.voucherForm.get('PersonName').setValue(data[0]['PersonName']);
      this.voucherForm.get('ReceivedBy').setValue(data[0]['ReceivedBy']);
      this.voucherForm.get('Serial').setValue(data[0]['Serial']);
      this.voucherForm.get('ServerCode').setValue(data[0]['ServerCode']);
      this.voucherForm.get('StoreCode').setValue(data[0]['StoreCode']);
      this.voucherForm.get('StoreName').setValue(data[0]['StoreName']);
      this.voucherForm.get('TAmount').setValue(data[0]['TAmount']);
      this.voucherForm.get('TContactCode').setValue(data[0]['TContactCode']);
      this.voucherForm.get('TIsCredit').setValue(data[0]['TIsCredit']);
      this.voucherForm.get('TTerms').setValue(data[0]['TTerms']);
      this.voucherForm.get('TTotCommission').setValue(data[0]['TTotCommission']);
      this.voucherForm.get('TransCode').setValue(data[0]['TransCode']);
      this.voucherForm.get('TransDate').setValue(data[0]['TransDate']);
      this.voucherForm.get('TransName').setValue(data[0]['TransName']);
      this.voucherForm.get('TransNum').setValue(data[0]['TransNum']);
      this.voucherForm.get('TransType').setValue(data[0]['TransType']);

      this.isDisplayData = true;
      this.sourceDoc = data[0]['TransNum'];

      this.oldTcode = data[0]['TransCode'];
      this.mode = 'edit';

      this.getVoucherItems(this.queries[6], this.voucherForm.get('Serial').value);
      this.handleShowHide(data[0]['TransCode'], data[0]['DestBranchCode']);  
      if (data[0]['StoreCode'].substring(1) == 'LOAN' || data[0]['StoreCode'] == 'LON' || data[0]['StoreCode'] == 'DEM')
        this.isOnLoan = true;
      // (  Or (InStr(1, LabStoreCode, "DEM") <> 0)) And (SumGridCol(SS_Lines1, 3) = 1)
      (this.objID == 9) && this.getMRNs(serial);    
    }

    getVoucherItems(query, num) {
      let criteria = (num == '') ? '' : `ItemsInOutL.Serial = '${num}'`
      this.resetArrofItems();

      this.service.gridData(query, criteria)
        .then(res => {
          const items = JSON.parse(<any>res);

          for (let i = 0; i <= items.length - 1; i++) {
            if (!this.isDisplayData) {
              this.setTransToGrid(items[i]);
              return;
            }
            this.addValuesToForm(items[i]);            
            this.addToGrid(items[i], 'recive'); 
            
            if (i == items.length - 1) {
              this.gridData = this.itemsRecived;
            } 
            
            this.itemsRecivedWitoutFilter.push(items[i]);
          }

        })       
    }

  //#endregion  

  //#region 
    showNotification(type, title, message) { // notification
      let options = (this.getLang() == 'EN') ? {nzClass: 'lang-en'} : {nzClass: 'lang-ar'};
      this.notification.create(type, title, message, options);
    }      
  //#endregion

  //#region 

    // deal with grid
    // Mohammed Hamouda - 03/15/2021

    hideGrid() {
      this.isShowGrid = false;
      this.isValidItemCode = false;
      this.isValidQuantity = false;
      this.isAdd = true;
    }

    showGrid() {
      this.isShowGrid = true;
      this.resetGridForm();
    }

    editGrid() {
      this.service.numberOfUsage("ItemSerials", "SerialNum", "ID='" + this.arrOfItems[this.indexOfItemToBeUpdated].ID + "'")
        .then(
          res => {
            const result = parseInt(<any>res, 10);
            const newQty = this.gridVoucherForm.get('Qty').value;
            const oldQty = this.arrOfItems[this.indexOfItemToBeUpdated]["Qty"];

            const newItemNum = this.gridVoucherForm.get('ItemCode').value;
            const oldItemNum = this.arrOfItems[this.indexOfItemToBeUpdated]["ItemCode"];
            const itemName = this.arrOfItems[this.indexOfItemToBeUpdated]["ItemName"];

            if (result > 0 && newItemNum.toLowerCase() != oldItemNum.toLowerCase()) {
              this.showNotification('warning', this.lang.genericErrMsgTitle, this.lang.voucherItemChangeMsg)
              this.gridVoucherForm.get('ItemCode').setValue(oldItemNum);
              this.gridVoucherForm.get('ItemName').setValue(itemName);
              return;
            } 

            if (parseFloat(newQty) < result) {
              let msg;

              (this.getLang() == 'EN')
                ? msg = `There are ${result} serial numbers entered for this item which are more than the quantity you entered. Please Delete some of these serials first.`
                : msg = `يوجد ${result} ارقام تسلسلية لهذا الصنف. بالرجاء حذف بعض هذه الارقام اولا`

              this.showNotification('warning', this.lang.genericErrMsgTitle, msg);
              this.gridVoucherForm.get('Qty').setValue(oldQty);
              return;
            }

            const {Cost, ID, Price, StoreCode, Trn_ID, ...rest} = this.gridVoucherForm.getRawValue();
            const id = this.arrOfItems[this.indexOfItemToBeUpdated].id;
      
            this.arrOfItems[this.indexOfItemToBeUpdated] = this.gridVoucherForm.getRawValue();
            this.arrOfItems[this.indexOfItemToBeUpdated].id = id;
            rest.id = id;
      
            if (this.arrOfItems[this.indexOfItemToBeUpdated].TransCode == 'PUR') {
              let price = parseFloat(this.arrOfItems[this.indexOfItemToBeUpdated].price);
              this.arrOfItems[this.indexOfItemToBeUpdated].Price = price * parseFloat(this.voucherForm.get('ChangeRage').value);
            }  
            
            if (this.arrOfItems[this.indexOfItemToBeUpdated].Cost == '' || this.arrOfItems[this.indexOfItemToBeUpdated].Cost == null) {
              this.arrOfItems[this.indexOfItemToBeUpdated].Cost = 0;
            }
      
            const updatedItem: any[] = [this.indexOfItemToBeUpdated, rest]; 
            this.binding.sendUpdatedItem(updatedItem);
      
            this.isShowGrid = true;            
          }
        )
    }

    addToGrid(item: any = {}, type = "new") {
      // add item to grid
      this.addRow(item);    

      // add item to arr of item
      this.addItemToArr(item);
      
      // reset form
      this.resetGridForm(); 
    }

    addToGridFromManu() {
      let sql = "SELECT ItemsComponents.ItemCodeComponent, ItemsDirectory.ItemName, ItemsComponents.Qty FROM ItemsDirectory INNER JOIN "
      sql += "ItemsComponents ON ItemsDirectory.ItemCode = ItemsComponents.ItemCodeComponent WHERE (ItemsComponents.ItemCode = N'" + this.onLoanForm.get('ItemCode').value + "')";      
      this.service.gridData(sql, "").then(
        res => {
          let data = JSON.parse(<any>res);         

          if (data.length != 0) {
            this.isRowLoader = true;
            for (let i = 0; i<= data.length -1; i++) {
              this.gridVoucherForm.get('ItemCode').setValue(data[i]['ItemCodeComponent']);
              this.gridVoucherForm.get('ItemName').setValue(data[i]['ItemName'])
              this.gridVoucherForm.get('Qty').setValue(parseFloat(data[i]['Qty']) * parseFloat(this.onLoanForm.get('Qty').value));
  
              this.addToGrid();
  
              if (i == data.length - 1) {
                this.isRowLoader = false;
                this.isOnLoanItem = false;
                this.resetGridForm();
                this.resetOnLoanForm();
              }
            }
          } else {
            this.showNotification('warning', this.lang.warningGenericMsgTitle, this.lang.noMaterials);
          }
        }        
      ).catch(
        err => {
          this.showNotification('error', this.lang.genericErrMsgTitle, this.lang.genericErrMsgDetails);
          this.isRowLoader = false;
        }
      )
    }

    addRowByEnter() {
      if (this.isAdd && this.isValidItemCode && this.isValidQuantity)
        this.validateGridBeforeAddOrUpdate('add');

      if (!this.isAdd && this.isValidItemCode && this.isValidQuantity)
        this.validateGridBeforeAddOrUpdate('edit');        
    }

    addRow(item: any = {}) {
      const {Cost, ID, Price, StoreCode, Trn_ID, ...rest} = this.gridVoucherForm.getRawValue();
  
      (Object.keys(item).length > 0) ? this.itemsRecived.push(rest)  : this.gridData = rest;
    } 

    addItemToArr(item: any = {}) {
      this.i++;    
      const isItem = (Object.keys(item).length > 0) ? true : false;
  
      const addProp = (!isItem) ? this.gridVoucherForm.getRawValue() : item;
      addProp.id = this.i;

      if (item.TransCode == 'PUR') {
        let price = parseFloat(item.price);
        item.Price = price * parseFloat(this.voucherForm.get('ChangeRage').value);
      }
  
      this.arrOfItems = [
        ...this.arrOfItems,
        addProp      
      ];
  
       // num of items on grid
       this.header.gridrowlnum = this.arrOfItems.length;
  
       // remove first object from array 
       (isItem) && this.arrOfItems.unshift();
    }
    
    resetArrofItems() {
      this.i = 0;
      this.gridData = [];
      this.arrOfItems = [];
      this.itemsRecived = [];
      this.itemsRecivedWitoutFilter = [];
    }    

  //#endregion

  //#region 

    // deal with modal
    // Mohammed Hamouda - 03/15/2021

    fillPopUp (index, type) {
      this.popupType = type;

      if (index == 0) {
        this.data = this.customersData;
        this.pouppTitle = 'customer/Vendor';
      } else if (index == 5) {
        this.data = this.transTypeData;
        this.pouppTitle = 'TransCode';
      } else if (index == 1) {
        this.data = this.storesData;
        this.pouppTitle = 'store';
      } else if (index == 4) {
        this.data = this.costCentersData;
        this.pouppTitle = 'cost centers';
      } else if (index == 3) {
        this.data = this.branchesData;
        this.pouppTitle = 'Branches';
      } else if (index == 2) {
        this.data = this.deliveryMethodsData;
        this.pouppTitle = 'Delivered By';
      } else if (index == -1) {
        let tCode = this.voucherForm.get('TransCode').value;
        let tNum = this.voucherForm.get('TransNum').value;
        let TBDtl = '';
        let FldName = '';
        let query;

        this.pouppTitle = 'Items';

        switch (tCode) {
          case "SAL": TBDtl = "SalesDtl"; FldName = "SaleNum";break;
          case "CRET": TBDtl = "SalesReturnDtl"; FldName = "RetNum";break;
          case "PUR": TBDtl = "PurchaseDtl"; FldName = "PurNum";break;
          case "VRET": TBDtl = "PurchaseReturnDtl"; FldName = "RetNum";break;
          case "VORD": TBDtl = "ServiceOrderDtl"; FldName = "OrderNum";break;
          default: this.data = this.itemsData; break;
        }

        if (TBDtl != '') {
          query = "SELECT  top 100 " + TBDtl + ".ItemCode, ItemsDirectory.ItemName, " + TBDtl + ".Qty, SUM(ItemsInOutL.Qty) AS " + (this.TransType == 1 ? "Received" : "Issued") + ", " + TBDtl + ".ID as ID, " + (tCode == "VORD" ? "0 AS Price" : TBDtl + ".Price As Price") + ", ItemsDirectory.PartNumber, Items.Location FROM " + TBDtl + " INNER JOIN ItemsDirectory ON " + TBDtl + ".ItemCode = ItemsDirectory.ItemCode  INNER JOIN Items ON " + TBDtl + ".ItemCode=Items.ItemCode LEFT OUTER JOIN ItemsInOutL ON " + TBDtl + ".ID = ItemsInOutL.Trn_ID WHERE ((" + TBDtl + "." + FldName + " = '" + tNum + "') AND (ItemsDirectory.ItemType = 0) AND (Items.BranchCode='" + localStorage.getItem('branchCode') + "')) GROUP BY " + TBDtl + ".ItemCode, " + TBDtl + ".Qty, ItemsDirectory.ItemName, " + TBDtl + ".ID, " + (tCode == "VORD" ? "" : TBDtl + ".Price,") + " ItemsDirectory.PartNumber, Items.Location ORDER BY " + TBDtl + ".ItemCode";
          this.service.getcriteriasss(query).toPromise()
            .then(
              res => {
                let data: any = res;
                this.data = [];
                console.log(data)
                if (data.length > 0) {
                  for (let i = 0; i <= data.length - 1; i++) {
                    let {ID, Price, ...rest} = data[i];
                    this.currentPrice = Price;
                    this.trnID = ID;
                    this.data.push(rest);
                  }
                }
              }
            )
        }
      } else if (index == -2) {
        let tCode = this.voucherForm.get('TransCode').value;
        let tNum = this.voucherForm.get('TransNum').value;
        let transNumQuery;

        this.pouppTitle = 'Source Doc. #';

        switch (tCode) {
          case "SAL":
            transNumQuery = "SELECT DISTINCT SalesHdr.SaleNum, SalesHdr.CustCode, SalesHdr.SaleDate, Persons.PersonName, SalesHdr.CurrencyCode, SalesHdr.ChangeRate, SalesHdr.CenterCode, CenterName, SalesHdr.Salesman AS TContactCode, SalesHdr.Terms AS TTerms, SalesHdr.IsCredit AS TIsCredit, SalesHdr.Amount AS TAmount, SalesHdr.TotCommission AS TTotCommission"
            transNumQuery = transNumQuery + " FROM SalesHdr INNER JOIN SalesDtl ON SalesHdr.SaleNum = SalesDtl.SaleNum INNER JOIN Persons ON SalesHdr.CustCode = Persons.PersonCode LEFT OUTER JOIN CostCenters ON SalesHdr.CenterCode=CostCenters.CenterCode INNER JOIN ItemsDirectory ON SalesDtl.ItemCode = ItemsDirectory.ItemCode LEFT OUTER JOIN ItemsInOutL ON SalesDtl.ID = ItemsInOutL.Trn_ID WHERE ((SalesHdr.Service = 0) AND (SalesHdr.BranchCode='" + localStorage.getItem('branchCode') + "') AND (ItemsDirectory.ItemType = 0)) GROUP BY SalesHdr.SaleNum, SalesHdr.SaleDate, SalesHdr.CustCode, Persons.PersonName, SalesHdr.CurrencyCode, SalesHdr.ChangeRate, SalesHdr.CenterCode, CenterName, SalesDtl.ID, SalesDtl.Qty, SalesHdr.Closed, SalesHdr.Salesman, SalesHdr.Terms, SalesHdr.IsCredit, SalesHdr.Amount, SalesHdr.TotCommission HAVING ((SUM(ItemsInOutL.Qty) < SalesDtl.Qty) OR (SUM(ItemsInOutL.Qty) IS NULL) AND (SalesHdr.Closed = 0)) OR (SalesHdr.SaleNum = '" + tNum + "') ORDER BY SaleDate DESC"            
            break;
          case "CRET":
            transNumQuery = "SELECT DISTINCT SalesReturnHdr.RetNum, SalesReturnHdr.RetDate, SalesReturnHdr.CustCode, Persons.PersonName, SalesReturnHdr.CurrencyCode, SalesReturnHdr.ChangeRate, SalesReturnHdr.CenterCode, CenterName, SalesReturnHdr.Salesman AS TContactCode, Null AS TTerms, SalesReturnHdr.IsCredit AS TIsCredit, SalesReturnHdr.Amount AS TAmount, SalesReturnHdr.TotCommission AS TTotCommission FROM SalesReturnHdr INNER JOIN SalesReturnDtl ON SalesReturnHdr.RetNum = SalesReturnDtl.RetNum INNER JOIN Persons ON SalesReturnHdr.CustCode = Persons.PersonCode LEFT OUTER JOIN CostCenters ON SalesReturnHdr.CenterCode=CostCenters.CenterCode "
            transNumQuery = transNumQuery + " INNER JOIN ItemsDirectory ON SalesReturnDtl.ItemCode = ItemsDirectory.ItemCode LEFT OUTER JOIN ItemsInOutL ON SalesReturnDtl.ID = ItemsInOutL.Trn_ID WHERE ((SalesReturnHdr.BranchCode='" + localStorage.getItem('branchCode') + "') AND (ItemsDirectory.ItemType = 0)) GROUP BY SalesReturnHdr.RetNum, SalesReturnHdr.RetDate, SalesReturnHdr.CustCode, Persons.PersonName, SalesReturnHdr.CurrencyCode, SalesReturnHdr.ChangeRate, SalesReturnHdr.CenterCode, CenterName, SalesReturnDtl.ID, SalesReturnDtl.Qty, SalesReturnHdr.Salesman, SalesReturnHdr.IsCredit, SalesReturnHdr.Amount, SalesReturnHdr.TotCommission HAVING (SUM(ItemsInOutL.Qty) < SalesReturnDtl.Qty) OR (SUM(ItemsInOutL.Qty) IS NULL) OR (SalesReturnHdr.RetNum = '" + tNum + "') ORDER BY RetDate DESC"
            break;
          case "PUR":
            transNumQuery = "SELECT DISTINCT PurchaseHdr.PurNum, PurchaseHdr.PurDate, PurchaseHdr.VendCode, Persons.PersonName, PurchaseHdr.CurrencyCode, PurchaseHdr.ChangeRate, PurchaseHdr.CenterCode, CenterName, PurchaseHdr.BuyerCode AS TContactCode, PurchaseHdr.Terms AS TTerms, PurchaseHdr.IsCredit AS TIsCredit, PurchaseHdr.Amount AS TAmount, 0 AS TTotCommission, PurchaseHdr.InvNum "
            transNumQuery = transNumQuery + " FROM PurchaseHdr INNER JOIN PurchaseDtl ON PurchaseHdr.PurNum = PurchaseDtl.PurNum INNER JOIN Persons ON PurchaseHdr.VendCode = Persons.PersonCode LEFT OUTER JOIN CostCenters ON PurchaseHdr.CenterCode=CostCenters.CenterCode INNER JOIN ItemsDirectory ON PurchaseDtl.ItemCode = ItemsDirectory.ItemCode LEFT OUTER JOIN ItemsInOutL ON PurchaseDtl.ID = ItemsInOutL.Trn_ID WHERE ((PurchaseHdr.BranchCode='" + localStorage.getItem('branchCode') + "') AND (ItemsDirectory.ItemType = 0)) GROUP BY PurchaseHdr.PurNum, PurchaseHdr.PurDate, PurchaseHdr.VendCode, Persons.PersonName, PurchaseHdr.CurrencyCode, PurchaseHdr.ChangeRate, PurchaseHdr.CenterCode, CenterName"
            transNumQuery = transNumQuery + ", PurchaseDtl.ID, PurchaseDtl.Qty, PurchaseHdr.InvNum,PurchaseHdr.Closed, PurchaseHdr.BuyerCode, PurchaseHdr.Terms, PurchaseHdr.IsCredit, PurchaseHdr.Amount HAVING ((SUM(ItemsInOutL.Qty) < PurchaseDtl.Qty) OR (SUM(ItemsInOutL.Qty) IS NULL) AND (PurchaseHdr.Closed = 0)) OR (PurchaseHdr.PurNum = '" + tNum + "') ORDER BY PurDate DESC"
            break;
          case "VRET":
            transNumQuery = "SELECT DISTINCT PurchaseReturnHdr.RetNum, PurchaseReturnHdr.RetDate, PurchaseReturnHdr.VendCode, Persons.PersonName, PurchaseReturnHdr.CurrencyCode, PurchaseReturnHdr.ChangeRate, PurchaseReturnHdr.CenterCode, CenterName, PurchaseReturnHdr.BuyerCode AS TContactCode, NULL AS TTerms, PurchaseReturnHdr.IsCredit AS TIsCredit, PurchaseReturnHdr.Amount AS TAmount, 0 AS TTotCommission FROM PurchaseReturnHdr INNER JOIN PurchaseReturnDtl ON PurchaseReturnHdr.RetNum = PurchaseReturnDtl.RetNum INNER JOIN Persons ON PurchaseReturnHdr.VendCode = Persons.PersonCode LEFT OUTER JOIN CostCenters ON PurchaseReturnHdr.CenterCode=CostCenters.CenterCode INNER JOIN ItemsDirectory ON PurchaseReturnDtl.ItemCode = ItemsDirectory.ItemCode LEFT OUTER JOIN ItemsInOutL ON PurchaseReturnDtl.ID = ItemsInOutL.Trn_ID"
            transNumQuery = transNumQuery + " WHERE ((PurchaseReturnHdr.BranchCode='" + localStorage.getItem('branchCode') + "') AND (ItemsDirectory.ItemType = 0)) GROUP BY PurchaseReturnHdr.RetNum, PurchaseReturnHdr.RetDate, PurchaseReturnHdr.VendCode, Persons.PersonName, PurchaseReturnHdr.CurrencyCode, PurchaseReturnHdr.ChangeRate, PurchaseReturnHdr.CenterCode, CenterName, PurchaseReturnDtl.ID, PurchaseReturnDtl.Qty, PurchaseReturnHdr.BuyerCode, PurchaseReturnHdr.IsCredit, PurchaseReturnHdr.Amount HAVING (SUM(ItemsInOutL.Qty) < PurchaseReturnDtl.Qty) OR (SUM(ItemsInOutL.Qty) IS NULL) OR (PurchaseReturnHdr.RetNum = '" + tNum + "') ORDER BY RetDate DESC"
            break;
          case "VORD":
            transNumQuery = "SELECT DISTINCT ServiceOrderHdr.OrderNum, ServiceOrderHdr.OrderDate, ServiceOrderHdr.CustCode, ServiceOrderHdr.CustName, '001' as CurrencyCode, 1 as ChangeRate, NULL AS CenterCode, NULL AS CenterName, ServiceMan AS TContactCode, NULL AS TTerms, NULL AS TIsCredit, NULL AS TAmount, NULL AS TTotCommission"
            transNumQuery = transNumQuery + " FROM ServiceOrderHdr INNER JOIN ServiceOrderDtl ON ServiceOrderHdr.OrderNum = ServiceOrderDtl.OrderNum INNER JOIN ItemsDirectory ON ServiceOrderDtl.ItemCode = ItemsDirectory.ItemCode LEFT OUTER JOIN ItemsInOutL ON ServiceOrderDtl.ID = ItemsInOutL.Trn_ID WHERE ((ServiceOrderHdr.BranchCode='" + localStorage.getItem('branchCode') + "') AND (ItemsDirectory.ItemType = 0)) GROUP BY ServiceOrderHdr.OrderNum, ServiceOrderHdr.OrderDate, ServiceOrderHdr.CustCode, ServiceOrderHdr.CustName, ServiceOrderDtl.ID, ServiceOrderDtl.Qty, ServiceMan HAVING (SUM(ItemsInOutL.Qty) < ServiceOrderDtl.Qty) OR (SUM(ItemsInOutL.Qty) IS NULL) OR (ServiceOrderHdr.OrderNum = '" + tNum + "') ORDER BY OrderDate DESC"
            break;
          default :
            transNumQuery = '';
            this.data = [];
            this.isVisible = true;
            break;    
        }

        this.transNumQuery = transNumQuery;

        if (transNumQuery != '') {          
          this.service.getcriteriasss(transNumQuery).toPromise()
            .then(
              res => {
                let data: any = res;
                this.data = data;
                this.isVisible = true;
              }
            )
        }
      } else if (index == -3) {
        this.data = this.mtnData;
        this.pouppTitle = 'M.T.N #';
      } else if (index == 7) {
        this.data = this.targetStoreData;
        this.pouppTitle = 'Target Store';
      } else if (index == -4) {
        this.data = this.onLoanData;
        this.pouppTitle = 'Full Products';
      }
      
      this.original = this.data;
      if (this.pouppTitle != 'Source Doc. #') {
        this.isVisible = true;      
      }
    }

    tblPageChangeHandler(data){
      this.tblData = data;
    } 

    onItemClicked(index) {

      switch(this.popupType) {
        case 'customer/Vendor' :
          this.voucherForm.get('PersonCode').setValue(this.tblData[index]['PersonCode']); 
          this.voucherForm.get('PersonName').setValue(this.tblData[index]['PersonName']);
          break; 
        case 'TransCode' :
          let transCode = this.tblData[index]['TransCode'];
          let destBranchCode = this.voucherForm.get('DestBranchCode').value;
          this.voucherForm.get('TransCode').setValue(this.tblData[index]['TransCode']); 
          this.voucherForm.get('TransName').setValue(this.tblData[index]['TransName']);  
          this.voucherForm.get('TransNum').setValue('');
          this.handleShowHide(transCode, destBranchCode);

          this.currentPrice =  0;
          this.trnID = '';

          this.i = 0;
          this.gridData = [];
          this.arrOfItems = [];          
          break; 
        case 'store' :          
          this.voucherForm.get('StoreName').setValue(this.tblData[index]['StoreName']); 
          this.voucherForm.get('StoreCode').setValue(this.tblData[index]['StoreCode']);
          break;
        case 'costCenter' :          
          this.voucherForm.get('CenterName').setValue(this.tblData[index]['CenterName']); 
          this.voucherForm.get('CenterCode').setValue(this.tblData[index]['CenterCode']);
          break; 
        case 'branch' :       
          this.voucherForm.get('BranchName').setValue(this.tblData[index]['BranchName']); 
          this.voucherForm.get('DestBranchCode').setValue(this.tblData[index]['BranchCode']);
          break; 
        case 'delivery' :       
          this.voucherForm.get('DeliveredBy').setValue(this.tblData[index]['DeliveryMethod']);
          break; 
        case 'onLoan' :    
          this.onLoanForm.get('ItemCode').setValue(this.tblData[index]['ItemCode']);
          this.onLoanForm.get('ItemName').setValue(this.tblData[index]['ItemName']);
          break;          
        case 'items' :  
          let inOrOutQty = this.TransType == 1 ? "Received" : "Issued";
          let storeCode = this.voucherForm.get('StoreCode').value;

          this.gridVoucherForm.get('ItemCode').setValue(this.tblData[index]['ItemCode']);
          this.gridVoucherForm.get('ItemName').setValue(this.tblData[index]['ItemName']);
          this.gridVoucherForm.get('StoreCode').setValue(storeCode);

          (this.tblData[index].hasOwnProperty('Qty')) && this.gridVoucherForm.get('Qty').setValue(this.tblData[index]['Qty']);
          this.gridVoucherForm.get('Price').setValue(this.currentPrice);
          this.gridVoucherForm.get('Trn_ID').setValue(this.trnID);

          this.currentQty = this.tblData[index]['Qty'];           
          this.inOrOutQty = (this.tblData[index][inOrOutQty] == null || this.tblData[index][inOrOutQty] == '') ? 0 : parseFloat(this.tblData[index][inOrOutQty]);

          this.isValidItemCode = true;
          this.isValidQuantity = true;
          break;
        case 'source_doc' : 
          if (this.arrOfItems.length > 0) { 
            this.showNotification('warning', this.lang.genericErrMsgTitle, this.lang.genericChangeFieldWarning);           
            return;
          }

          let tCode = this.voucherForm.get('TransCode').value;

          switch (tCode) {
            case "SAL":               
              this.voucherForm.get('TransNum').setValue(this.tblData[index]['SaleNum']);
              this.voucherForm.get('ChangeRate').setValue(this.tblData[index]['ChangeRate']);
              this.voucherForm.get('CurrencyCode').setValue(this.tblData[index]['CurrencyCode']);
              this.voucherForm.get('CenterCode').setValue(this.tblData[index]['CenterCode']);
              this.voucherForm.get('CenterName').setValue(this.tblData[index]['CenterName']);  
              this.voucherForm.get('TContactCode').setValue(this.tblData[index]['TContactCode']); 
              this.voucherForm.get('TTerms').setValue(this.tblData[index]['TTerms']);
              this.voucherForm.get('TIsCredit').setValue(this.tblData[index]['TIsCredit']); 
              this.voucherForm.get('TAmount').setValue(this.tblData[index]['TAmount']); 
              this.voucherForm.get('TTotCommission').setValue(this.tblData[index]['TTotCommission']);
              break;
            case "CRET":
              this.voucherForm.get('TransNum').setValue(this.tblData[index]['ItemCode']);

              this.voucherForm.get('ChangeRate').setValue(this.tblData[index]['ChangeRate']);
              this.voucherForm.get('CurrencyCode').setValue(this.tblData[index]['CurrencyCode']);
              this.voucherForm.get('CenterCode').setValue(this.tblData[index]['CenterCode']);
              this.voucherForm.get('CenterName').setValue(this.tblData[index]['CenterName']);  
              this.voucherForm.get('TContactCode').setValue(this.tblData[index]['TContactCode']); 
              this.voucherForm.get('TTerms').setValue(this.tblData[index]['TTerms']);
              this.voucherForm.get('TIsCredit').setValue(this.tblData[index]['TIsCredit']); 
              this.voucherForm.get('TAmount').setValue(this.tblData[index]['TAmount']); 
              this.voucherForm.get('TTotCommission').setValue(this.tblData[index]['TTotCommission']);
              break;
            case "PUR":
              this.voucherForm.get('TransNum').setValue(this.tblData[index]['ItemCode']);

              this.voucherForm.get('TransNum').setValue(this.tblData[index]['PurNum']);
              this.voucherForm.get('ChangeRate').setValue(this.tblData[index]['ChangeRate']);
              this.voucherForm.get('CurrencyCode').setValue(this.tblData[index]['CurrencyCode']);
              this.voucherForm.get('CenterCode').setValue(this.tblData[index]['CenterCode']);
              this.voucherForm.get('CenterName').setValue(this.tblData[index]['CenterName']);  
              this.voucherForm.get('TContactCode').setValue(this.tblData[index]['TContactCode']); 
              this.voucherForm.get('TTerms').setValue(this.tblData[index]['TTerms']);
              this.voucherForm.get('TIsCredit').setValue(this.tblData[index]['TIsCredit']); 
              this.voucherForm.get('TAmount').setValue(this.tblData[index]['TAmount']); 
              this.voucherForm.get('TTotCommission').setValue(this.tblData[index]['TTotCommission']);            
              break;
            case "VRET":
              this.voucherForm.get('TransNum').setValue(this.tblData[index]['ItemCode']);

              this.voucherForm.get('ChangeRate').setValue(this.tblData[index]['ChangeRate']);
              this.voucherForm.get('CurrencyCode').setValue(this.tblData[index]['CurrencyCode']);
              this.voucherForm.get('CenterCode').setValue(this.tblData[index]['CenterCode']);
              this.voucherForm.get('CenterName').setValue(this.tblData[index]['CenterName']);  
              this.voucherForm.get('TContactCode').setValue(this.tblData[index]['TContactCode']); 
              this.voucherForm.get('TTerms').setValue(this.tblData[index]['TTerms']);
              this.voucherForm.get('TIsCredit').setValue(this.tblData[index]['TIsCredit']); 
              this.voucherForm.get('TAmount').setValue(this.tblData[index]['TAmount']); 
              this.voucherForm.get('TTotCommission').setValue(this.tblData[index]['TTotCommission']);
              break;
            case "VORD":
              this.voucherForm.get('TransNum').setValue(this.tblData[index]['OrderNum']);

              this.voucherForm.get('ChangeRate').setValue(this.tblData[index]['ChangeRate']);
              this.voucherForm.get('CurrencyCode').setValue(this.tblData[index]['CurrencyCode']);
              this.voucherForm.get('CenterCode').setValue(this.tblData[index]['CenterCode']);
              this.voucherForm.get('CenterName').setValue(this.tblData[index]['CenterName']);  
              this.voucherForm.get('TContactCode').setValue(this.tblData[index]['TContactCode']); 
              this.voucherForm.get('TTerms').setValue(this.tblData[index]['TTerms']);
              this.voucherForm.get('TIsCredit').setValue(this.tblData[index]['TIsCredit']); 
              this.voucherForm.get('TAmount').setValue(this.tblData[index]['TAmount']); 
              this.voucherForm.get('TTotCommission').setValue(this.tblData[index]['TTotCommission']); 
              break;
            default :
              break;    
          }

          /*if (!this.isDisplayData) {
            this.i = 0;
            this.gridData = [];
            this.arrOfItems = [];
          }*/
          this.setLinesData();
          break;
        case "MTN" :
          this.voucherForm.get('MTN').setValue(this.tblData[index]["Serial"])
          break; 
        case 'Target Store' :
          this.creatingMRNForm.get('storeCode').setValue(this.tblData[index]['StoreCode']); 
          this.creatingMRNForm.get('storeName').setValue(this.tblData[index]['StoreName']);
          this.isValidStroe = true;
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
    
    sotrHandler(event) {
      this.data = event;
    } 
    
    handleCancel(){ // close popup
      this.isVisible = false;      
    } 

    closeMRN() {
      this.isCareteMRNVisible = false;
      this.resetCreatingMRNForm();
    }

    closeOnLoan() {
      this.isOnLoanItem = false;
      this.isValidQuantity = false;
      this.isValidItemCode = false;
      this.resetOnLoanForm();
    }

  //#endregion

  //#region 

    // validate values when user leav the input
    // Mohammed Hamouda - 03/15/2021

    checkIsHaveVal(type) { // conditions when user leave the input
      let value;
      
      switch(type) {
        case 'customers_vendors' :
          value = this.voucherForm.get('PersonCode').value; 
          let customers_vendors =  this.customersData.filter(c => c.PersonCode == value);
          if (value != "" && customers_vendors.length == 0) {
            this.binding.showMessage("validValue");
            this.customers_vendors.nativeElement.focus();
            return
          } 

          if (customers_vendors.length > 0) {
            this.voucherForm.get('PersonCode').setValue(customers_vendors[0]['PersonCode']); 
            this.voucherForm.get('PersonName').setValue(customers_vendors[0]['PersonName']);
          }
          break;  
        case 'TransCode' :
          value = this.voucherForm.get('TransCode').value; 
          let transCode =  this.transTypeData.filter(t => t.TransCode == value);
          if (value != "" && transCode.length == 0) {
            this.binding.showMessage("validValue");
            this.customers_vendors.nativeElement.focus();
            return
          } 

          if (transCode.length > 0) {
            this.voucherForm.get('TransCode').setValue(transCode[0]['TransCode']); 
            this.voucherForm.get('TransName').setValue(transCode[0]['TransName']);
          }
          break;
        case 'store' :
          value = this.voucherForm.get('StoreName').value; 
          let store =  this.storesData.filter(s => s.StoreName == value);
          if (value != "" && store.length == 0) {
            this.binding.showMessage("validValue");
            this.store.nativeElement.focus();
            return
          } 

          if (store.length > 0) {
            this.voucherForm.get('StoreName').setValue(store[0]['StoreName']); 
            this.voucherForm.get('StoreCode').setValue(store[0]['StoreCode']);
          }
          break;
        case 'costCenter' :
          value = this.voucherForm.get('CenterName').value; 
          let costCenter =  this.costCentersData.filter(c => c.CenterName == value);
          if (value != "" && costCenter.length == 0) {
            this.binding.showMessage("validValue");
            this.costCenter.nativeElement.focus();
            return
          } 

          if (costCenter.length > 0) {
            this.voucherForm.get('CenterName').setValue(costCenter[0]['CenterName']); 
            this.voucherForm.get('CenterCode').setValue(costCenter[0]['CenterCode']);
          }
          break; 
        case 'branch' :
          value = this.voucherForm.get('BranchName').value; 
          let branches =  this.branchesData.filter(b => b.BranchName == value);
          if (value != "" && branches.length == 0) {
            this.binding.showMessage("validValue");
            this.branches.nativeElement.focus();
            return
          } 

          if (branches.length > 0) {
            this.voucherForm.get('BranchName').setValue(branches[0]['BranchName']); 
            this.voucherForm.get('BranchCode').setValue(branches[0]['BranchCode']);
          }
          break;          
        case 'delivery' :
          value = this.voucherForm.get('DeliveredBy').value; 
          let delivery =  this.deliveryMethodsData.filter(d => d.DeliveryMethod == value);
          if (value != "" && delivery.length == 0) {
            this.binding.showMessage("validValue");
            this.delivery.nativeElement.focus();
            return
          } 

          if (delivery.length > 0) {
            this.voucherForm.get('DeliveredBy').setValue(delivery[0]['DeliveryMethod']);
          }
          break; 
        case 'items' :
          value = this.gridVoucherForm.get('ItemCode').value; 
          let items =  this.itemsData.filter(i => i.ItemCode == value);
          if (value != "" && items.length == 0) {
            this.binding.showMessage("validValue");
            this.items.nativeElement.focus();
            return
          } 

          if (items.length > 0) {
            this.gridVoucherForm.get('ItemCode').setValue(items[0]['ItemCode']);
            this.gridVoucherForm.get('ItemName').setValue(items[0]['ItemName']);
            this.isValidItemCode = true;
          }
          break;
        case 'MTN' :
          value = this.voucherForm.get('MTN').value; 
          let mtn =  this.mtnData.filter(s => s.Serial == value);
          if (value != "" && mtn.length == 0) {
            this.binding.showMessage("validValue");
            this.MTN_control.nativeElement.focus();
            return
          } 

          if (items.length > 0) {
            this.voucherForm.get('MTN').setValue(items[0]['Serial']);
          }
          break; 
        case 'target_store' :
          value = this.creatingMRNForm.get('storeCode').value; 
          let targetStore =  this.targetStoreData.filter(s => s.StoreCode == value);
          if (value != "" && targetStore.length == 0) {
            this.binding.showMessage("validValue");
            this.target_store.nativeElement.focus();
            return
          }  
          
          if (targetStore.length > 0) {
            this.creatingMRNForm.get('storeCode').setValue(targetStore[0]['StoreCode']);
            this.creatingMRNForm.get('storeName').setValue(targetStore[0]['StoreName']);
            this.isValidStroe = true;
          }
          break;  
        case 'onLoanItem' :
          value = this.onLoanForm.get('ItemCode').value; 
          let onLoanItems =  this.onLoanData.filter(i => i.ItemCode == value);
          if (value != "" && onLoanItems.length == 0) {
            this.binding.showMessage("validValue");
            this.onLoanItem.nativeElement.focus();
            return
          } 

          if (items.length > 0) {
            this.onLoanForm.get('ItemCode').setValue(onLoanItems[0]['ItemCode']);
            this.isValidItemCode = true;
          }
          break;                   
      }
    }      

  //#endregion

  //#region 

  createArrForValidation() {
    let ItemCode, Qty, ItemName;
    let validationArr: any[] = [];
    let exit;
    let j = 0;

    if (this.isDisplayData) {
      do {
        exit = false;
  
        if (validationArr.length > 0) {
          for (let i = 0; i <= validationArr.length - 1; i ++) {
  
            if (validationArr[i]["ItemCode"] == this.itemsRecivedWitoutFilter[j]["ItemCode"] && validationArr[i]["StoreCode"] == this.itemsRecivedWitoutFilter[j]["StoreCode"]) {
              validationArr[i]["OldQty"] = parseFloat(validationArr[i]["OldQty"]) + parseFloat(this.itemsRecivedWitoutFilter[j]["Qty"]);
              exit = true;
              break;
            }
          }
        }
  
        if (!exit) {
          let b = validationArr.length;
  
          validationArr.push({
            ItemCode: this.arrOfItems[b]["ItemCode"],
            ItemName: this.arrOfItems[b]["ItemName"],
            StoreCode: this.arrOfItems[b]["StoreCode"],
            OldQty: parseFloat(this.itemsRecivedWitoutFilter[b]["Qty"]),
            ID: "",         
            SumOfQty: 0,
            Cost: 0,
            NewCost: 0,
            Added: false          
          });
        }
  
        j++;      
      } while (j != this.arrOfItems.length);
    }

    for (let i = 0; i <= this.arrOfItems.length - 1; i ++) {

      ItemCode = this.arrOfItems[i]["ItemCode"];
      ItemName = this.arrOfItems[i]["ItemName"];
      Qty = parseFloat(this.arrOfItems[i]["Qty"])      

      exit = false;
      for (let j = 0; j <= validationArr.length - 1; j++) {
        if (validationArr[i]["ItemCode"] == ItemCode && validationArr[j]["StoreCode"] == this.voucherForm.get('StoreCode').value) {
          validationArr[i]["SumOfQty"] = validationArr[i]["SumOfQty"] + Qty;
          exit = true;
          break;
        }
      }


      if (!exit) {
        validationArr.push({
          ItemCode: ItemCode,
          ItemName: ItemName,
          StoreCode: this.voucherForm.get('StoreCode').value,
          OldQty: 0,
          ID: "",         
          SumOfQty: Qty,
          Cost: 0,
          NewCost: 0,
          Added: false          
        });        
      }
    }

    return validationArr;

  }

  async verifyItemBalance(type, arr) {
    let Bal, Qty, OnHndQty = 0;

    if (type == 'add' && this.TransType == 1 || (type == 'delete' && this.TransType == -1))
      return true;
    
    for (let i = 0; i <= arr.length - 1; i++) {
      if ((type == 'delete' && this.TransType == 1) || (type == 'add' && this.TransType == -1)) {
        Qty = - (arr[i]['SumOfQty']);
        OnHndQty = 0;
      } else if (type == 'edit' && this.TransType == 1) {
        Qty = arr[i]["SumOfQty"] - arr[i]["OldQty"];
        OnHndQty = - (arr[i]["OldQty"]);

        let OriginalTnsDate = await this.service.tblInfo("ItemsInOutH", "TransDate", "Serial='" + this.voucherForm.get('Serial').value + "'", "", "", "", "", "");
        let d1 = Date.parse(this.voucherForm.get('TransDate').value);
        let d2 = Date.parse(OriginalTnsDate[0]["TransDate"].toString());

        if ((d1 > d2))  this.dateIsAdvanced = true;

      } else if (type == 'edit' && this.TransType == -1) {
        Qty = -(arr[i]["SumOfQty"] - arr[i]["OldQty"]);
        OnHndQty = arr[i]["OldQty"];

        let OriginalTnsDate = await this.service.tblInfo("ItemsInOutH", "TransDate", "Serial='" + this.voucherForm.get('Serial').value + "'", "", "", "", "", "");
        let d1 = Date.parse(this.voucherForm.get('TransDate').value);
        let d2 = Date.parse(OriginalTnsDate[0]["TransDate"].toString());

        if ((d1 < d2))  this.dateIsRetarded = true;
      }
      
      Bal = await this.service.getItemBalance(arr[i]["ItemCode"], arr[i]["StoreCode"], this.formatDate(this.voucherForm.get('TransDate').value));
      OnHndQty = (Bal == "" ? 0 : (parseFloat(Bal)) + parseFloat(OnHndQty.toString()));

      if ((Bal == "" ? 0 : parseFloat(Bal) + (Qty == "" ? 0 : parseFloat(Qty))) < 0) {
        let msg = (this.getLang() == 'EN') 
          ? `<b>Item Code :</b> ${arr[i]["ItemCode"]} \r\n <br> <b>Description :</b> ${arr[i]["ItemName"]} \r\n <br> <b>On Hand Qty :</b> ${OnHndQty}`
          : `<b>كود الصنف :</b> ${arr[i]["ItemCode"]} \r\n <br> <b>الوصف :</b> ${arr[i]["ItemName"]} \r\n <br> <b>الكمية :</b> ${OnHndQty}`;
        this.showNotification('warning', this.lang.outOfStock, msg);
        return false;
      }

      OnHndQty = parseFloat(OnHndQty.toString()) - (Bal == "" ? 0 : parseFloat(Bal));
      Bal = await this.service.getItemBalance(arr[i]["ItemCode"], arr[i]["StoreCode"], "");
      OnHndQty = (Bal == "" ? 0 : (parseFloat(Bal)) + parseFloat(OnHndQty.toString()));
      Bal = parseFloat(Bal) + parseFloat(Qty);
      Qty = await this.service.DSum("ReservationHdr, ReservationDtl", "Qty", "ReservationHdr.RsvNum=ReservationDtl.RsvNum AND BranchCode='" + localStorage.getItem('branchCode') + "' AND ItemCode='" + arr[i]["ItemCode"] + "' AND IsExpired=0");
      Bal = (parseFloat(Bal) - parseFloat(Qty));
      if (parseFloat(Bal) < 0) {
        let msg = (this.getLang() == 'EN') 
          ? `<b>Item Code :</b> ${arr[i]["ItemCode"]} \r\n <br> <b>Description :</b> ${arr[i]["ItemName"]} \r\n <br> On <b>Hand Qty :</b> ${OnHndQty}`
          : `<b>كود الصنف :</b> ${arr[i]["ItemCode"]} \r\n <br> <b>الوصف :</b> ${arr[i]["ItemName"]} \r\n <br> <b>الكمية :</b> ${OnHndQty}`;
        this.showNotification('warning', this.lang.outOfStock, msg);
        return false;
      }      
    }

    return true;
  }

  async callVerifyItemBalance(type, arr) {
    if (await !this.verifyItemBalance(type, arr)) 
      return false;
    else return true;
  }

  getArrToBeSent(data) {
    // add items to array
    let arr: any[] = [];
    let beforeCommitObject = { 
      ObjectId: this.objID, 
      TransNum: data.TransNum, 
      TransCode: data.TransCode, 
      TransDate: data.TransDate, 
      Mode: this.mode, 
      TxtSerial: data.Serial, 
      OldTCode: this.oldTcode, 
      TransType: this.TransType, 
      Glb_Branch_Code: localStorage.getItem('branchCode'), 
      DateIsRetarted: this.dateIsRetarded, 
      DateIsAdvanced: this.dateIsAdvanced, 
      ItemArr: this.createArrForValidation() 
    }
    
    // remove id prop
    for(let i = 0; i <= this.arrOfItems.length - 1; i++) {
      const {id, ...objWithoutId} = this.arrOfItems[i];
      arr.push(objWithoutId);
    } 
    
    // add header values
    arr.unshift(data);
    
    // get masters
    this.header.masters = data.Serial;
    this.header.gridIndex = Object.keys(data).length;
    this.header.beforeCommitObject = JSON.stringify(beforeCommitObject); 
    
    let arrToBeSent: any[] = []
    arrToBeSent.push(this.header);
    arrToBeSent.push(arr);
    
    return arrToBeSent    
  }

  //#endregion

  //#region 

    // add & update function
    // Mohammed Hamouda - 03/17/2021

    addNew(data, branchCode, serverCode) {
      let num;
      let {frmType, ...rest} = data;
      this.service.getMaxNumOfRecords("ItemsInOutH", "DocNum", `BranchCode='${branchCode}'`).toPromise()
      .then(res => {
        num = res;
        this.voucherForm.get('DocNum').setValue(num + 1);
  
        rest.Serial = `${branchCode}${serverCode}${frmType}${num + 1}`;  
        rest.DocNum = num + 1;
        rest.TransType = this.TransType ;
        (rest["DestBranchCode"] == '') ? rest.DestBranchCode = branchCode : null;

        // check posting
        this.service.checkPosting('Serial', rest.Serial, 'STK', rest.TransDate, 'ItemsInOutH', branchCode)
        .then(                    
          res => {                      
            let obj: any = res;
            let title = (this.getLang() == "EN") ? "Invalid Date" : "تاريخ غير صالح"
            let msg = (this.getLang() == "EN") ? obj.latin : obj.arabic;

            if (typeof(res) == 'object') {
              this.returnData.emit([]) 
            } else {
              this.isNewRecord = true;
              this.returnData.emit(this.getArrToBeSent(rest));
            }
              
            (typeof(res) == 'object') && this.showNotification('warning', title, msg);
          }
        )              
        
      })
      .catch(err => this.showNotification("err", this.lang.genericErrMsgTitle, err));     
    }  
    
    updateData(data, branchCode) {
      let {frmType, ...rest} = data;

      this.service.checkPosting('Serial', rest.Serial, 'STK', rest.TransDate, 'ItemsInOutH', branchCode)
      .then(                    
        res => {                      
          let obj: any = res;
          let title = (this.getLang() == "EN") ? "Invalid Date" : "تاريخ غير صالح"
          let msg = (this.getLang() == "EN") ? obj.latin : obj.arabic;

          if (typeof(res) == 'object') {
            this.returnData.emit([]) 
          } else {
            (!this.checkBeforeUpdate(this.itemsRecivedWitoutFilter, this.getArrToBeSent(rest)))
              ? this.returnData.emit([])
              : this.returnData.emit(this.getArrToBeSent(rest));
          }
            
          (typeof(res) == 'object') && this.showNotification('warning', title, msg);
        }
      );           
    }

    checkBeforeUpdate(original, modified) {
      let {frmType, DateCreated, DateModified, ...originalHeader} = this.originalDataRecived;
      let modifiedHeader = modified[1].shift();
      
      originalHeader.TransDate = this.formatDate(originalHeader.TransDate);

      let modifiedArr = modified[1];
      let originalLength = original.length;

      if (!_.isEqual(originalHeader, modifiedHeader))
        return true;      

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
      
      return true;
    }

  //#endregion

  //#region 

    // validation
    // Mohammed Hamouda - 03/17/2021

    checkQuantity(val, type = "voucher") {
      let convertedVal = parseFloat(val);
      if (Number.isNaN(convertedVal) || convertedVal <= 0) {
        (type == 'voucher') ? this.gridVoucherForm.get('Qty').setValue('') : this.onLoanForm.get('Qty').setValue('');        
        this.binding.showMessage('quntity');
      }

      if (convertedVal > 0 && !Number.isNaN(convertedVal))
        this.isValidQuantity = true;
      else
        this.isValidQuantity = false;
    } 

    inheritedTrans(tCode) {
      const inheritedTrans = (tCode == "SAL" || tCode == "CRET" || tCode == "PUR" || tCode == "VRET" || tCode == "VORD");
      return inheritedTrans;
    }

    validateGridBeforeAddOrUpdate(type) {
      const qty = parseFloat(this.gridVoucherForm.get('Qty').value);
      const tCode = this.voucherForm.get('TransCode').value;
      const tNum = this.voucherForm.get('TransNum').value;

      let remQty = 0;
      let invQty: any = 0;

      let isUpdate = (type == 'edit') ? true : false;

      if (tNum != '' && this.inheritedTrans(tCode)) {
        remQty = this.currentQty - this.inOrOutQty;

        if (type == 'edit') {
          this.service.DSum("ItemsInOutL", "Qty", "Trn_ID='" + this.trnID + "' AND Serial='" + this.voucherForm.get('Serial').value + "'")
            .then(
              res => {
                invQty = parseFloat(<any>res);
                isUpdate = false;
              }
            )
        }

        const checkIsUpdate = setInterval(() => {
          if (!isUpdate) {
            if (qty > remQty + invQty) {
              this.showNotification('warning', this.lang.genericErrMsgTitle, `${(this.TransType == 1 ? "Received" : "Issued")} ${this.lang.qtyMsgDetails}`);
              clearInterval(checkIsUpdate); 
              return false;                          
            }

            (type == 'edit') ? this.editGrid() : this.addToGrid();
            clearInterval(checkIsUpdate);
          }
        }, 10);         
      } else {
        (type == 'edit') ? this.editGrid() : this.addToGrid();
      }
    }

    setLinesData() { // add data to grid when system transaction
      let Q, TBDtl, FldName, Rs, systemTrans, sql;
      let tCode = this.voucherForm.get('TransCode').value;
      let tNum = this.voucherForm.get('TransNum').value;

      if (this.transNumQuery != '') {
        if (!this.validatEntry(tNum, this.transNumQuery, 'sd')) return false;
      }

      systemTrans = true;
      switch (tCode) {
        case "SAL": TBDtl = "SalesDtl"; FldName = "SaleNum";break;
        case "CRET": TBDtl = "SalesReturnDtl"; FldName = "RetNum";break;
        case "PUR": TBDtl = "PurchaseDtl"; FldName = "PurNum";break;
        case "VRET": TBDtl = "PurchaseReturnDtl"; FldName = "RetNum";break;
        case "VORD": TBDtl = "ServiceOrderDtl"; FldName = "OrderNum";break;
        default:
          systemTrans = false;
          sql = "";
          break;
      }
      
      if (!systemTrans) {
        sql = "SELECT top 100 Items.ItemCode, ItemsDirectory.ItemName, ItemsDirectory.PartNumber, ItemsBrnQtys.OnHndQty, Items.Location FROM Items INNER JOIN ItemsDirectory ON Items.ItemCode = ItemsDirectory.ItemCode LEFT OUTER JOIN ItemsBrnQtys ON Items.ItemCode = ItemsBrnQtys.ItemCode AND Items.BranchCode = ItemsBrnQtys.BranchCode WHERE Items.BranchCode='" + localStorage.getItem('branchCode') + "' ORDER By Items.ItemCode"
      } else {
        sql = "SELECT  top 100 " + TBDtl + ".ItemCode, ItemsDirectory.ItemName, " + TBDtl + ".Qty, SUM(ItemsInOutL.Qty) AS " + (this.TransType == 1 ? "Received" : "Issued") + ", " + TBDtl + ".ID as ID, " + (tCode == "VORD" ? "0 AS Price" : TBDtl + ".Price As Price") + ", ItemsDirectory.PartNumber, Items.Location FROM " + TBDtl + " INNER JOIN ItemsDirectory ON " + TBDtl + ".ItemCode = ItemsDirectory.ItemCode  INNER JOIN Items ON " + TBDtl + ".ItemCode=Items.ItemCode LEFT OUTER JOIN ItemsInOutL ON " + TBDtl + ".ID = ItemsInOutL.Trn_ID WHERE ((" + TBDtl + "." + FldName + " = '" + tNum + "') AND (ItemsDirectory.ItemType = 0) AND (Items.BranchCode='" + localStorage.getItem('branchCode') + "')) GROUP BY " + TBDtl + ".ItemCode, " + TBDtl + ".Qty, ItemsDirectory.ItemName, " + TBDtl + ".ID, " + (tCode == "VORD" ? "" : TBDtl + ".Price,") + " ItemsDirectory.PartNumber, Items.Location ORDER BY " + TBDtl + ".ItemCode";
      }      
      
      if (this.arrOfItems.length == 0 && tNum != '' && systemTrans) {
        this.getVoucherItems(sql, '');
      }
    }

    setTransToGrid(item) {
      let inOrOutQty = this.TransType == 1 ? "Received" : "Issued";
      let storeCode = this.voucherForm.get('StoreCode').value;

      this.gridVoucherForm.get('ItemCode').setValue(item['ItemCode']);
      this.gridVoucherForm.get('ItemName').setValue(item['ItemName']);
      this.gridVoucherForm.get('StoreCode').setValue(storeCode);

      (item.hasOwnProperty('Qty')) && this.gridVoucherForm.get('Qty').setValue(item['Qty']);
      this.gridVoucherForm.get('Price').setValue(item["Price"]);
      this.gridVoucherForm.get('Trn_ID').setValue(item["ID"]);

      this.currentQty = item['Qty'];           
      this.inOrOutQty = (item[inOrOutQty] == null || item[inOrOutQty] == '') ? 0 : parseFloat(item[inOrOutQty]);

      this.addToGrid();
    }    

    async validatEntry(value, query, type) {
      let criteria = '';

      if (type == 'T') {
        criteria = "InvTransTypes.TransCode=  '" + value + "'"
      }
  
      if (type == "c") {
        criteria = "Persons.PersonCode=  '" + value + "'"
      }
  
      if (type == "cs") {
        criteria = "CostCenters.CenterCode=  '" + value + "'"
      }

      if (type == "s") {
        criteria = "Stores.StoreName=  '" + value + "'"
      }

      if (type == "sd") {
        let tNum = this.voucherForm.get('TransCode').value;
        switch (tNum) {
          case "SAL":criteria = "SalesHdr.SaleNum= '" + value + "'";break;
          case "CRET":criteria = "SalesHdr.RetNum= '" + value + "'";break;
          case "PUR":criteria = "PurchaseHdr.PurNum= '" + value + "'";break;
          case "VRET":criteria = "PurchaseReturnHdr.RetNum= '" + value + "'";break;
          case "VORD":criteria = "ServiceOrderHdr.OrderNum= '" + value + "'";break;
        }        
      }
      
      let data = await this.service.loadPopUpCheckvalue(query, value, criteria)

      if (!data) return false;
    }

  //#endregion

  //#region 

    // handle show/hide
    // Mohammed Hamouda - 18/03/2021

    handleShowHide(transCode, destBranchCode) {    
        // show deliver by
        (transCode == 'MTN') ? this.isMTN = true : this.isMTN = false;

        // show create MTN
        (transCode == 'MTN' && this.isDisplayData == true && destBranchCode == localStorage.getItem('branchCode'))
          ? this.isCreateMRN = true
          : this.isCreateMRN = false;

        // show MTN
        if (transCode == 'MRN') {
          let mtn = (this.voucherForm.get('MTN').value == '') ? "" : this.voucherForm.get('MTN').value;
          let destBranchCode = (this.voucherForm.get('DestBranchCode').value == '') ? localStorage.getItem('branchCode') : this.voucherForm.get('DestBranchCode').value;
          let query = `SELECT DISTINCT ItemsInOutH.Serial, ItemsInOutH.TransDate FROM ItemsInOutH LEFT OUTER JOIN ItemsInOutH ItemsInOutH1 ON ItemsInOutH.Serial = ItemsInOutH1.MTN WHERE ((ItemsInOutH.TransCode = 'MTN') AND (ItemsInOutH1.MTN IS NULL) AND (ItemsInOutH.BranchCode='${destBranchCode}') AND (ItemsInOutH.DestBranchCode='${localStorage.getItem('branchCode')}')) OR (ItemsInOutH.Serial='${mtn}')`;

          this.service.getcriteriasss(query).toPromise()
          .then(
            res => {
              this.mtnData = <any>res;
              this.isMRN = true; 
            }
          )                       
        } else {
          this. mtnData = [];
          this.isMRN = false;
        }      
    }
    
    getMRNs(serial) {
      this.mrns = '';
      let mrns = '';
      this.service.getDataFrmVoucher(serial)
        .then(
          res => {
            let data: any = res;           
            if (data.length == 0) {
              this.mrns = ""
            } else {
              for (let i = 0; i <= data.length - 1; i++) {
                this.mrns += data[i].MRN + ", " ;
              }
            }
          }
        )
    }

  //#endregion

  //#region 

    // calc quantity
    // Mohammed Hamouda - 18/03/2021

    calcQuantity(data) {
      let totalQty = 0;
      for (let i = 0; i <= data.length; i++) {
        totalQty += parseInt(data[i]['Qty'])
      }
      return totalQty;
    }

  //#endregion

  //#region 

  // eveents
  // Mohammed Hamouda - 02/03/2021

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { // stop calling filpup function when click enter
    if (event.key === 'Enter') {
      event.preventDefault();
      return
    }
  }

  @HostListener('window:keyup', ['$event'])
  onEsc(event) { // show grid
    if (event.keyCode == 27) {
      this.isShowGrid = true;
    }
  }  

  //#endregion 
  
  //#region 

  // create MRN
  // Mohammed Hamouda - 21/03/2021

  createMRN() {
    let serial = this.voucherForm.get('Serial').value;
    let storeCode = this.creatingMRNForm.get('storeCode').value;
    let branchCode = localStorage.getItem('branchCode');
    let username = localStorage.getItem('username');
    let msg;

    this.isCreatingMRN = true;

    this.service.CreateMRN(serial, storeCode, branchCode, username, 1)
      .then(
        res => {
          msg = (this.getLang() == 'EN') ? <any>res["latin"] : <any>res["arabic;"]
          this.showNotification('success', this.lang.mrnTitle, msg); 
          this.resetCreatingMRNForm();
          this.isCreatingMRN = false;
        },
        err => {
          msg = (this.getLang() == 'EN') ? err.error.latin : err.error.arabic;
          this.showNotification('warning', this.lang.genericErrMsgTitle, msg); 
          this.isCreatingMRN = false;
        }
      )
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

          if (this.isNewRecord) {
            let code = localStorage.getItem('branchCode');
            let docNum = this.voucherForm.get('DocNum').value;
            let frmType = (this.objID == 9) ? 'i' : 'r';
            let cri = `ItemsInOutH.Serial = '${code}${code}${frmType}${docNum}'`;

            this.service.loadData(localStorage.getItem('sqlStm'), cri).subscribe(
              res => {
                this.displayData(res);
                this.isNewRecord = false;
                this.isDisplayData = true;
                clearInterval(isReset);
                return;
              }
            )          
          }

          this.i = 0;
          this.gridData = [];
          this.arrOfItems = [];
          this.itemsRecivedWitoutFilter = [];
          this.isDisplayData = false;
          this.isMTN = false;
          this.isMRN = false;
          this.isCreateMRN = false;
          this.isValidStroe = false;
          this.isOnLoan = false;
          this.dateIsAdvanced = false;
          this.dateIsRetarded = false;
          this.currentQty = 0;
          this.currentPrice = 0;
          this.inOrOutQty = 0;
          this.trnID = '';
          this.oldTcode = '';
          this.mode = 'add';

          this.resetVoucherForm();
          this.resetGridForm();
          this.resetCreatingMRNForm();
          this.resetOnLoanForm();

          this.setDefaultValues();

          this.getCurrentDate();
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
        this.mode = 'delete';
        if (this.isDelete) {
          let {frmType, ...data} = this.voucherForm.getRawValue(); 

          if (!this.callVerifyItemBalance('delete', this.createArrForValidation())) {
            this.returnData.emit([]);
            clearInterval(isDelete);            
            return;
          }

          this.service.numberOfUsage('ItemSerials', 'SerialNum', `Serial = '${data.Serial}'`)
            .then(
              res => {

                if (parseInt(<any>res) > 0) {
                  this.modal.confirm({
                    nzTitle: this.lang.changeInvoicConfirmTitle,
                    nzContent: this.lang.serialConfirmMsg,
                    nzCancelText: this.lang.cancel,
                    nzOkText: this.lang.confirm,
                    nzOkType: 'primary',
                    nzOnOk: () => {
                      this.service.execQuery(`DELETE FROM ItemSerials WHERE Serial= '${data.Serial}'`).toPromise()
                        .then(
                          res => {
                            
                            this.service.numberOfUsage('ItemsOnLoanHdr', 'Serial', `Serial = '${data.Serial}'`)
                              .then(
                                res => {
                                  if (data.StoreCode.toUpperCase().slice(-4) == "LOAN" || data.StoreCode.toUpperCase().slice(-3) == "LON" || data.StoreCode.slice(1).includes("DEM") && parseInt(<any>res) > 0) {
                                    this.modal.confirm({
                                      nzTitle: this.lang.changeInvoicConfirmTitle,
                                      nzContent: this.lang.deleteLoanlConfirmMsg,
                                      nzCancelText: this.lang.cancel,
                                      nzOkText: this.lang.confirm,
                                      nzOkType: 'primary',
                                      nzOnOk: () => {
                                        this.service.execQuery(`DELETE FROM ItemsOnLoanDtl WHERE Serial= '${data.Serial}'`).toPromise()
                                          .catch(
                                            err => {
                                              this.showNotification('error', this.lang.genericErrMsgTitle, err.error.ExceptionMessage);
                                              this.returnData.emit([]);
                                              clearInterval(isDelete);
                                              return; 
                                            }                                
                                          )
                                        this.service.execQuery(`DELETE FROM ItemsOnLoanHdr WHERE Serial= '${data.Serial}'`).toPromise()
                                          .catch(
                                            err => {
                                              this.showNotification('error', this.lang.genericErrMsgTitle, err.error.ExceptionMessage);
                                              this.returnData.emit([]);
                                              clearInterval(isDelete);
                                              return; 
                                            }                                
                                          )
                                        this.returnData.emit(this.getArrToBeSent(data));
                                      },                            
                                      nzClassName: (this.getLang() == 'AR') ? 'lang-ar' : 'lang-en'
                                    })                                     
                                  } else {
                                    this.returnData.emit(this.getArrToBeSent(data));
                                    clearInterval(isDelete);
                                    return;  
                                  }
                                }
                              )
                              .catch(
                                err => {
                                  this.showNotification('error', this.lang.genericErrMsgTitle, err.error.ExceptionMessage);
                                  this.returnData.emit([]);
                                  clearInterval(isDelete);
                                  return; 
                                }                                
                              )
                          },                          
                        )
                        .catch(
                          err => {
                            this.showNotification('error', this.lang.genericErrMsgTitle, err.error.ExceptionMessage);
                            this.returnData.emit([]);
                            clearInterval(isDelete);
                            return;                           
                          }
                        )
                    }, 
                    nzOnCancel: () => {
                      this.returnData.emit([]);
                      clearInterval(isDelete);
                      return;
                    },                            
                    nzClassName: (this.getLang() == 'AR') ? 'lang-ar' : 'lang-en'
                  })                 
                } else {
                  this.service.numberOfUsage('ItemsOnLoanHdr', 'Serial', `Serial = '${data.Serial}'`)
                  .then(
                    res => {
                      if (data.StoreCode.toUpperCase().slice(-4) == "LOAN" || data.StoreCode.toUpperCase().slice(-3) == "LON" || data.StoreCode.slice(1).includes("DEM") && parseInt(<any>res) > 0) {
                        this.modal.confirm({
                          nzTitle: this.lang.changeInvoicConfirmTitle,
                          nzContent: this.lang.deleteLoanlConfirmMsg,
                          nzCancelText: this.lang.cancel,
                          nzOkText: this.lang.confirm,
                          nzOkType: 'primary',
                          nzOnOk: () => {
                            this.service.execQuery(`DELETE FROM ItemsOnLoanDtl WHERE Serial= '${data.Serial}'`).toPromise()
                            this.service.execQuery(`DELETE FROM ItemsOnLoanHdr WHERE Serial= '${data.Serial}'`).toPromise()                           
                            this.returnData.emit(this.getArrToBeSent(data)); 
                          },                            
                          nzClassName: (this.getLang() == 'AR') ? 'lang-ar' : 'lang-en'
                        })                                  
                      } else {
                        this.returnData.emit(this.getArrToBeSent(data));
                        clearInterval(isDelete);
                        return;                         
                      }
                    }
                  ) 
                  .catch(
                    err => {
                      this.showNotification('error', this.lang.genericErrMsgTitle, err.error.ExceptionMessage);
                      this.returnData.emit([]);
                      clearInterval(isDelete);
                      return;                         
                    }                    
                  )                                                   
                }
              }
            )               
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
          let serial = this.voucherForm.get('Serial').value; 
          let isStock = false;
          let type = (this.isDisplayData) ? 'edit' : 'add';
          let data = this.voucherForm.getRawValue();

          let transDate = new Date(this.voucherForm.get('TransDate').value);

          let branchCode = localStorage.getItem('branchCode');
          let serverCode = localStorage.getItem('branchCode'); 

          data.TransDate = (typeof(transDate) == 'undefined') ? '' : this.formatDate(transDate);

          // validate Dest Branch Code
          if (data.DestBranchCode == '') {
            this.returnData.emit([]);
            this.showNotification('warning', this.lang.warningGenericMsgTitle, this.lang.missingDestBranchCode);
            clearInterval(isSaveOrUpdate);
            return;
          }
          
          // validate stok
          if (!this.callVerifyItemBalance(type, this.createArrForValidation())) {
            this.returnData.emit([]);                                  
            clearInterval(isSaveOrUpdate);           
            return;
          } else {
            isStock = true;
          }          

          // check if MRN
          const checkIsStock = setInterval(() => {
            if (isStock) {
              clearInterval(checkIsStock)
              if (data.MTN = '' && data.DestBranchCode != data.BranchCode && data.TransCode == 'MRN') {
                this.returnData.emit([]);
                this.showNotification('warning', this.lang.warningGenericMsgTitle, this.lang.missingMTN);
                clearInterval(isSaveOrUpdate);
                return;            
              } else {
                this.service.numberOfUsage("ItemsInOutH", "Serial", `Serial <> '${data.Serial}' And MTN = '${data.MTN}'`)
                  .then(
                    res => {
                      if (parseInt(<any>res) > 0) {
                        this.modal.confirm({
                          nzTitle: this.lang.changeInvoicConfirmTitle,
                          nzContent: this.lang.mrnAddedConfirmMsg,
                          nzCancelText: this.lang.cancel,
                          nzOkText: this.lang.confirm,
                          nzOkType: 'primary',
                          nzOnOk: () => {
                              // validation
                              this.service.tblInfo("InvTransTypes", "System", `TransCode='${data.TransCode}'`, "", "", "", "", "")
                              .then(
                                res => {
                                  if (res[0] == 1 && this.voucherForm.get('TransNum').value == '') {
                                    this.returnData.emit([]);
                                    this.showNotification('warning', this.lang.warningGenericMsgTitle, this.lang.missingTransNum);
                                    clearInterval(isSaveOrUpdate);
                                    return;
                                  } else {
                                    if (!this.isDisplayData) { // new voucher
                                      this.mode = 'add';
                                      this.addNew(data, branchCode, serverCode);                                                                 
                                    } else { // if update
                                    
                                      this.mode = 'edit';
                                      if (data.TransCode != "MTN" && data.TransCode != "MRN" && data.TransCode != "MRN" && data.DestBranchCode && data.DestBranchCode != branchCode) {
                                        data.DestBranchCode = branchCode;
                                        data.BranchName = localStorage.getItem('branchName');
                                        data.DestBranchName = localStorage.getItem('branchName');
                                      }
    
                                      if (this.TransType == 1 && data.TransCode != "MRN") {
                                        data.MTN = ''
                                      }
    
                                      if ((data.StoreCode.toUpperCase().slice(-4) == "LOAN") || (data.StoreCode.toUpperCase().slice(-3) == "LON" || data.StoreCode.toString().toUpperCase().slice(1).includes("DEM")) && (this.calcQuantity(this.arrOfItems) > 1 && data.DestBranchCode != branchCode)) {
                                        this.returnData.emit([]);
                                        this.showNotification('warning', this.lang.warningGenericMsgNotCompleteTitle, this.lang.onLoanQuantity);
                                        clearInterval(isSaveOrUpdate);
                                        return;
                                      }                                 
    
                                      // validate store
                                      this.service.tblInfo('ItemsInOutH', 'StoreCode', `Serial= '${data.Serial}'`, "", "", "", "", "")
                                        .then(
                                          res => {
                                            if (res.toString().toUpperCase().slice(-4) == "LOAN" || (res.toString().toUpperCase().slice(-3) == "LON") || (res.toString().toUpperCase().slice(1).includes("DEM"))) {
                                              this.service.numberOfUsage('ItemsOnLoanHdr', 'Serial', `Serial= '${data.Serial}'`)
                                                .then(
                                                  res => {
                                                    if (data.StoreCode.toString().slice(-4) == "LOAN" && (data.StoreCode.toUpperCase().slice(-4) != "LOAN" && data.StoreCode.slice(-3) != "LON" && (data.StoreCode.toString().toUpperCase().slice(1).includes("DEM") && parseInt(<any>res) > 0))) {
                                                      this.returnData.emit([]);
                                                      this.showNotification('warning', this.lang.warningGenericMsgTitle, this.lang.moreOnLoanDocument);
                                                      clearInterval(isSaveOrUpdate);
                                                      return;
                                                    }
    
                                                    this.updateData(data, branchCode);
                                                    clearInterval(isSaveOrUpdate);
                                                    return;                                                                                                 
                                                  }
                                                )
                                            } else {
                                              this.updateData(data, branchCode);
                                              clearInterval(isSaveOrUpdate);
                                              return;                                                                                     
                                            }
                                          }
                                        )                                  
                                    }
                                  }
                                }
                              )  
                          }, 
                          nzOnCancel: () => {
                            this.returnData.emit([]);
                            clearInterval(isSaveOrUpdate);
                            return;
                          },                            
                          nzClassName: (this.getLang() == 'AR') ? 'lang-ar' : 'lang-en'
                        })
                      } else {
                        this.service.tblInfo("InvTransTypes", "System", `TransCode='${data.TransCode}'`, "", "", "", "", "")
                        .then(
                          res => {
                            if (res[0] == 1 && this.voucherForm.get('TransNum').value == '') {
                              this.returnData.emit([]);
                              this.showNotification('warning', this.lang.warningGenericMsgTitle, this.lang.missingTransNum);
                              clearInterval(isSaveOrUpdate);
                              return;
                            } else {
                              if (!this.isDisplayData) { // new voucher
                                this.mode = 'add';
                                this.addNew(data, branchCode, serverCode);                         
                              } else { // if update
                                this.mode = 'edit';
                                if (data.TransCode != "MTN" && data.TransCode != "MRN" && data.TransCode != "MRN" && data.DestBranchCode && data.DestBranchCode != branchCode) {
                                  data.DestBranchCode = branchCode;
                                  data.BranchName = localStorage.getItem('branchName');
                                  data.DestBranchName = localStorage.getItem('branchName');
                                }
    
                                if (this.TransType == 1 && data.TransCode != "MRN") {
                                  data.MTN = ''
                                }
    
                                if ((data.StoreCode.toUpperCase().slice(-4) == "LOAN") || (data.StoreCode.toUpperCase().slice(-3) == "LON" || data.StoreCode.toString().toUpperCase().slice(1).includes("DEM")) && (this.calcQuantity(this.arrOfItems) > 1 && data.DestBranchCode != branchCode)) {
                                  this.returnData.emit([]);
                                  this.showNotification('warning', this.lang.warningGenericMsgNotCompleteTitle, this.lang.onLoanQuantity);
                                  clearInterval(isSaveOrUpdate);
                                  return;
                                }                            
    
                                // validate store
                                this.service.tblInfo('ItemsInOutH', 'StoreCode', `Serial= '${data.Serial}'`, "", "", "", "", "")
                                  .then(
                                    res => {
                                      if (res.toString().toUpperCase().slice(-4) == "LOAN" || (res.toString().toUpperCase().slice(-3) == "LON") || (res.toString().toUpperCase().slice(1).includes("DEM"))) {
                                        this.service.numberOfUsage('ItemsOnLoanHdr', 'Serial', `Serial= '${data.Serial}'`)
                                          .then(
                                            res => {
                                              if (data.StoreCode.toString().slice(-4) == "LOAN" && (data.StoreCode.toUpperCase().slice(-4) != "LOAN" && data.StoreCode.slice(-3) != "LON" && (data.StoreCode.toString().toUpperCase().slice(1).includes("DEM") && parseInt(<any>res) > 0))) {
                                                this.returnData.emit([]);
                                                this.showNotification('warning', this.lang.warningGenericMsgTitle, this.lang.moreOnLoanDocument);
                                                clearInterval(isSaveOrUpdate);
                                                return;
                                              }
    
                                              this.updateData(data, branchCode);
                                              clearInterval(isSaveOrUpdate);
                                              return;  
                                            }
                                          )
                                      } else {
                                        this.updateData(data, branchCode);
                                        clearInterval(isSaveOrUpdate);
                                        return                                                                             
                                      }
                                    }
                                  )                                  
                              }
                            }
                          }
                        )                   
                      }                
                    }
                  )
              } 
            }
          }, 10) ;
                     
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
          this.returnID.emit(this.voucherForm.get('Serial').value);
        }

        clearInterval(isReporting);
      }
    }, 100);

    // check new Obj ID
    const isNewObj = setInterval(() => {
      if (typeof (changes.objID) == 'undefined') {
        null;
      } else {
        this.objID = changes.objID.currentValue;
        
        (this.objID == 9) ? this.voucherForm.get('frmType').setValue('i') : this.voucherForm.get('frmType').setValue('r');
        (this.objID == 9) ? this.TransType = -1 : this.TransType = 1;
        this.getAllData();
        clearInterval(isNewObj);
      }
    }, 100);   
        
  }     

}
