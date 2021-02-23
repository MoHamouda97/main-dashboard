import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatabindingService } from 'src/services/databinding.service';
import { FrmService } from 'src/services/frm/frm.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as $ from 'jquery';
import * as lang from './../../../../../settings/lang';

@Component({
  selector: 'app-customer-requests',
  templateUrl: './customer-requests.component.html',
  styleUrls: ['./customer-requests.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CustomerRequestsComponent implements OnInit, OnChanges {
  // form var
  customerRequestForm: FormGroup;

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
  
  // for record ID
  isNew = (this.objID == 339) ? "A" : "U";

  // language
  lang: any;

  // Loader
  isSubGroup: boolean = false;

  // show / hide popup
  isVisible: boolean = false;

  // sql statments
  queries: any[] = [
    "Select CategoryCode, Description From SalCustomerCategories order by CategoryCode",
    "SELECT GroupID, PersonGroup FROM PersonsGroups WHERE PersonType=1 ORDER BY GroupID",
    "SELECT SubGroupID, PersonSubGroup FROM PersonsGroupsDtl",
    "SELECT Terms From Terms Order By Terms",
    "Select CenterCode, CenterName From CostCenters WHERE CenterIsFinal=1",
    "SELECT PersonCode,PersonName From Persons WHERE PersonType=3 AND Active=1 Order By PersonCode",
    "SELECT top 100 Persons.PersonCode, Persons.PersonName, Persons.PersonAltrName, Persons.CategoryCode, SalCustomerCategories.Description, Persons.PersonGroupID, Persons.PersonSubGroupID, Persons.CreditLimit, Persons.PmtTerms, Persons.Address, Persons.Fax, Persons.Phone, Persons.PoBox, Persons.Contact, Persons.ContactTitle, Persons.E_Mail, Persons.TradeLicenseNo, Persons.Telx AS VATno, Persons.CenterCode, CostCenters.CenterName, Persons.Active FROM Persons INNER JOIN SalCustomerCategories ON Persons.CategoryCode = SalCustomerCategories.CategoryCode INNER JOIN CostCenters ON Persons.CenterCode = CostCenters.CenterCode WHERE (Branchcode='" + localStorage.getItem('branchCode') + "' AND Persons.PersonType = 1 ) Order By PersonCode"
  ];

  // popup data
  popupData: any = [];
  tblData: any = [];
  original: any = [];
  popupType: string = '';
  pouppTitle: string = '';
  categoryData: any[] = [];
  groupData: any[] = [];
  subGroupData: any[] = [];
  termsData: any[] = [];
  costCenterData: any[] = [];
  requestedByData: any[] = [];
  customers: any[] = [];

  // for track validatable values
  @ViewChild('category', {static: true}) category: ElementRef; 
  @ViewChild('groupID', {static: true}) groupID: ElementRef;
  @ViewChild('subGroupID', {static: true}) subGroupID: ElementRef;
  @ViewChild('terms', {static: true}) terms: ElementRef;
  @ViewChild('centerCode', {static: true}) centerCode: ElementRef;
  @ViewChild('requestedBy', {static: true}) requestedBy: ElementRef;
  @ViewChild('trade', {static: true}) trade: ElementRef;
  @ViewChild('customer', {static: true}) customer: ElementRef;

  // for validation
  validationType = '';

  // used when sending email
  selectedData: any = [];

  constructor(
    private service: FrmService, 
    private binding: DatabindingService,
    private notification: NzNotificationService,  
    private fb: FormBuilder) { }

  ngOnInit() {
    this.customerRequestForm = this.fb.group({
      PersonCode: [""],
      RequestNum: [""],
      BranchCode: [localStorage.getItem("branchCode")],
      ServerCode: [localStorage.getItem("branchCode")],
      RequestDate: [""],
      RequestedBy: [""],
      BrnSerial: [""],
      PersonName: [""],
      PersonAltrName: [""],
      CategoryCode: [""],
      Description: [""],
      Contact: [""],
      PersonGroupID: [""],
      ContactTitle: [""],
      PersonSubGroupID: [""],
      PoBox: [""],
      PmtTerms: [""],
      Phone: [""],
      CenterCode: [""],
      CenterName: [""],
      E_Mail: [""],
      Address: [""],
      Notes: [""],
      VATno: [""],
      CreditLimit: ["0"],
      AltrPhone: [""],
      TradeLicenseNo: [""],
      Fax: [""]
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

    this.getCurrentDate();
  }

  //#region 

  getAllData() { // get all data
    return Promise.all([
      this.service.getcriteriasss(this.queries[0]).toPromise(), 
      this.service.getcriteriasss(this.queries[1]).toPromise(),
      this.service.getcriteriasss(this.queries[3]).toPromise(),
      this.service.getcriteriasss(this.queries[4]).toPromise(),
      this.service.getcriteriasss(this.queries[5]).toPromise(),
      this.service.getcriteriasss(this.queries[6]).toPromise()])
      .then(res => {
        let data: any = res;
        this.categoryData = data[0];
        this.groupData = data[1];
        this.termsData = data[2];
        this.costCenterData = data[3]; 
        this.requestedByData = data[4]; 
        this.customers = data[5];   
      })
      .catch(err => {
        this.showNotification('error', this.lang.genericErrMsgTitle, this.lang.genericErrMsgDetails)
      })
  }

  getCurrentDate() { // get server date
    this.service.getCurrentDate("MM/dd/yyyy").toPromise()
      .then(res => this.customerRequestForm.get('RequestDate').setValue(<string>res))
      .catch(err => this.showNotification("err", this.lang.genericErrMsgTitle, err));
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

    displayData(data: any, type = 'Edit') {
      this.selectedData = data; 
      if (type == 'Edit') {
        this.customerRequestForm.get('RequestNum').setValue(data[0].RequestNum);
        this.customerRequestForm.get('BranchCode').setValue(data[0].BranchCode);
        this.customerRequestForm.get('ServerCode').setValue(data[0].ServerCode);   
        this.customerRequestForm.get('BrnSerial').setValue(data[0].BrnSerial);
        this.customerRequestForm.get('RequestDate').setValue(data[0].RequestDate);
        this.customerRequestForm.get('RequestedBy').setValue(data[0].RequestedBy);
        this.customerRequestForm.get('PersonName').setValue(data[0].PersonName);
        this.customerRequestForm.get('PersonAltrName').setValue(data[0].PersonAltrName);
        this.customerRequestForm.get('CategoryCode').setValue(data[0].CategoryCode);
        this.customerRequestForm.get('Description').setValue(data[0].Description);
        this.customerRequestForm.get('Contact').setValue(data[0].Contact);
        this.customerRequestForm.get('PersonGroupID').setValue(data[0].PersonGroupID);
        this.customerRequestForm.get('ContactTitle').setValue(data[0].ContactTitle);
        this.customerRequestForm.get('PersonSubGroupID').setValue(data[0].PersonSubGroupID);
        this.customerRequestForm.get('PoBox').setValue(data[0].PoBox);
        this.customerRequestForm.get('PmtTerms').setValue(data[0].PmtTerms);
        this.customerRequestForm.get('Phone').setValue(data[0].Phone);
        this.customerRequestForm.get('CenterCode').setValue(data[0].CenterCode);
        this.customerRequestForm.get('CenterName').setValue(data[0].CenterName);
        this.customerRequestForm.get('E_Mail').setValue(data[0].E_Mail);
        this.customerRequestForm.get('Address').setValue(data[0].Address);
        this.customerRequestForm.get('Notes').setValue(data[0].Notes);
        this.customerRequestForm.get('VATno').setValue(data[0].VATno);
        this.customerRequestForm.get('CreditLimit').setValue(data[0].CreditLimit);
        this.customerRequestForm.get('AltrPhone').setValue(data[0].AltrPhone);
        this.customerRequestForm.get('TradeLicenseNo').setValue(data[0].TradeLicenseNo);
        this.customerRequestForm.get('Fax').setValue(data[0].Fax);
      } else {
        this.customerRequestForm.get('PersonName').setValue(data[0].PersonName);
        this.customerRequestForm.get('PersonAltrName').setValue(data[0].PersonAltrName);
        this.customerRequestForm.get('CategoryCode').setValue(data[0].CategoryCode);
        this.customerRequestForm.get('Description').setValue(data[0].Description);
        this.customerRequestForm.get('Contact').setValue(data[0].Contact);
        this.customerRequestForm.get('PersonGroupID').setValue(data[0].PersonGroupID);
        this.customerRequestForm.get('ContactTitle').setValue(data[0].ContactTitle);
        this.customerRequestForm.get('PersonSubGroupID').setValue(data[0].PersonSubGroupID);
        this.customerRequestForm.get('PoBox').setValue(data[0].PoBox);
        this.customerRequestForm.get('PmtTerms').setValue(data[0].PmtTerms);
        this.customerRequestForm.get('Phone').setValue(data[0].Phone);
        this.customerRequestForm.get('CenterCode').setValue(data[0].CenterCode);
        this.customerRequestForm.get('CenterName').setValue(data[0].CenterName);
        this.customerRequestForm.get('E_Mail').setValue(data[0].E_Mail);
        this.customerRequestForm.get('Address').setValue(data[0].Address);
        this.customerRequestForm.get('Notes').setValue(data[0].Notes);
        this.customerRequestForm.get('VATno').setValue(data[0].VATno);
        this.customerRequestForm.get('CreditLimit').setValue(data[0].CreditLimit);
        this.customerRequestForm.get('AltrPhone').setValue(data[0].AltrPhone);
        this.customerRequestForm.get('TradeLicenseNo').setValue(data[0].TradeLicenseNo);
        this.customerRequestForm.get('Fax').setValue(data[0].Fax);
      }
    }

  //#endregion  

  //#region 

    // format date to SQL format
    // Mohammed Hamouda 09/02/2021

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

    // get data for pop up
    // Mohammed Hamouda - 09/02/2021

    fillPopUp(index, type) {
      this.popupType = type;

      if (type == 'PersonSubGroupID') {
        let group = this.customerRequestForm.get('PersonGroupID').value;
        if (group == "" || group == null) {
          this.showNotification('warning', this.lang.customerRequestMsgTitle, this.lang.customerRequestMsgDetails)
          return;
        } else {
          this.data = this.subGroupData;
          this.pouppTitle = 'SubGroup';
          this.isVisible = true;
          return;
        }
      } else {        

        if (index == 0) {
          this.data = this.categoryData;
          this.pouppTitle = 'Category Code';
        } else if (index == 1) {
          this.data = this.groupData;
          this.pouppTitle = 'Group';
        } else if (index == 3) {
          this.data = this.termsData;
          this.pouppTitle = 'Pmt Terms';
        } else if (index == 4) {
          this.data = this.costCenterData;
          this.pouppTitle = 'Cost Center';
        } else if (index == 5) {          
          this.data = this.requestedByData;
          this.pouppTitle = 'RequestedBy';          
        } else if (index == 6) {
          this.data = this.customers;
          this.pouppTitle = 'Customers';   
        }

        this.original = this.data;
        this.isVisible = true;
      }
    }

  //#endregion

  //#region 

    // close the pop up
    // Mohammed Hamouda - 24/01/2021

    handleCancel(){
      this.isVisible = false;
    }

  //#endregion 
  
  // notification

  showNotification(type, title, message) {
    let options = (this.getLang() == 'EN') ? {nzClass: 'lang-en'} : {nzClass: 'lang-ar'};
    this.notification.create(type, title, message, options);
  }

  // this function is used to recive data from table pagination
  tblPageChangeHandler(data){
    this.tblData = data;
  } 
  
  // check when user click a row  

  onItemClicked(index) {

    switch(this.popupType) {
      case 'CategoryCode' :
        this.customerRequestForm.get('CategoryCode').setValue(this.tblData[index].CategoryCode);
        this.customerRequestForm.get('Description').setValue(this.tblData[index].Description);
        break;
      case 'PersonGroupID' :
        this.customerRequestForm.get('PersonGroupID').setValue(this.tblData[index].GroupID);
        this.getSubGroupData(this.tblData[index].GroupID);
        break; 
      case 'PmtTerms' :
        this.customerRequestForm.get('PmtTerms').setValue(this.tblData[index].Terms);
        break;
      case 'CenterCode' :
        this.customerRequestForm.get('CenterCode').setValue(this.tblData[index].CenterCode);
        this.customerRequestForm.get('CenterName').setValue(this.tblData[index].CenterName);
        break; 
      case 'PersonSubGroupID' :
        this.customerRequestForm.get('PersonSubGroupID').setValue(this.tblData[index].SubGroupID);
        break;
      case 'RequestedBy' :
        this.customerRequestForm.get('RequestedBy').setValue(this.tblData[index].PersonCode);
        break; 
      case 'Customer' :
        this.customerRequestForm.get('PersonCode').setValue(this.tblData[index].PersonCode);
        let data: any[] = [];
        data.push(this.tblData[index])
        this.displayData(data, 'Add')
        break;                                                
    }

    this.isVisible = false;
  }

  // filter

  filterData(key, val) { 

    (val == '') 
      ? this.data = this.original
      : this.data = this.data.filter(d => d[key].toString().toLocaleLowerCase().trim().includes(val.toLocaleLowerCase().trim()));
  } 
  
  // reset data value

  reset() {
    this.data = this.original;
  }

  // find data when user type

  findhData(val, type) {
    let data: any;

    switch(type) {
      case 'CategoryCode' :
        data = this.categoryData.filter(c => c.CategoryCode == val);
        if (data.length > 0) {
          this.customerRequestForm.get('CategoryCode').setValue(data[0].CategoryCode);
          this.customerRequestForm.get('Description').setValue(data[0].Description);
        } else {
          this.customerRequestForm.get('Description').reset();
        }
        break; 
      case 'CenterCode' :
        data = this.costCenterData.filter(c => c.CenterCode == val);
        if (data.length > 0) {
          this.customerRequestForm.get('CenterCode').setValue(data[0].CenterCode);
          this.customerRequestForm.get('CenterName').setValue(data[0].CenterName);
        } else {
          this.customerRequestForm.get('CenterName').reset();
        }
        break;             
    }
  }

  checkIsHaveVal(type) {
    let value;

    switch(type) {
      case 'CategoryCode' :
        value = this.customerRequestForm.get('CategoryCode').value;
        let catDescription = this.customerRequestForm.get('Description').value;
        if (value != "" && catDescription == null) {
          this.binding.showMessage("validValue");
          this.category.nativeElement.focus();
        }
        break;
      case 'PersonGroupID' :        
        value = this.customerRequestForm.get('PersonGroupID').value; 
        let dataToCheck = this.groupData.filter(c => c.GroupID == value);     
        if (value != "" && dataToCheck.length == 0) {
          this.binding.showMessage("validValue");
          this.groupID.nativeElement.focus();
        } else {
          this.getSubGroupData(value);
        }
        break; 
      case 'PersonSubGroupID' :        
        value = this.customerRequestForm.get('PersonSubGroupID').value; 
        let checkSubGroup = this.subGroupData.filter(s => s.SubGroupID == value);     
        if (value != "" && checkSubGroup.length == 0) {
          this.binding.showMessage("validValue");
          this.subGroupID.nativeElement.focus();
        }
        break;   
      case 'PmtTerms' :        
        value = this.customerRequestForm.get('PmtTerms').value; 
        let checkPmtTerms = this.termsData.filter(s => s.Terms == value);     
        if (value != "" && checkPmtTerms.length == 0) {
          this.binding.showMessage("validValue");
          this.terms.nativeElement.focus();
        }
        break;
      case 'CenterCode' :
        value = this.customerRequestForm.get('CenterCode').value;
        let centerName = this.customerRequestForm.get('CenterName').value;
        if (value != "" && centerName == null) {
          this.binding.showMessage("validValue");
          this.centerCode.nativeElement.focus();
        }
        break;  
      case 'RequestedBy' :
        value = this.customerRequestForm.get('RequestedBy').value;
        let checkRequestedBy = this.requestedByData.filter(r => r.PersonCode == value);
        if (value != "" && checkRequestedBy.length == 0) {
          this.binding.showMessage("validValue");
          this.requestedBy.nativeElement.focus();
        }
        break; 
      case 'customer' :
        value = this.customerRequestForm.get('Customer').value;
        let checkCustomer = this.customers.filter(c => c.PersonCode == value);
        if (value != "" && checkCustomer.length == 0) {
          this.binding.showMessage("validValue");
          this.requestedBy.nativeElement.focus();
        }
        break;                                             
    }
  }

  getSubGroupData(value) {
    let query = `SELECT SubGroupID, PersonSubGroup FROM PersonsGroupsDtl WHERE GroupID = '${value}'`;

    this.service.getcriteriasss(query).toPromise().then(res => {
      let data: any = res;
      this.subGroupData = data;
    });
  }

  // check trade

  checkTrade(val) {
    let checkTradeLicense = (this.objID == 339) ? '' : `AND PersonType = 1 AND BranchCode = '${localStorage.getItem("branchCode")}'`;

    this.validationType = 'validating';

    this.service.checkTradeLicense(
      "Persons", 
      "TradeLicenseNo", 
      `TradeLicenseNo='${val}' ${checkTradeLicense}`).subscribe(
        res => {
          this.validationType = '';

          if (res == 1) {
            this.showNotification('warning', this.lang.tradeMsgTitle, this.lang.tradeMsgDetails);
            $('#js_save_update').attr('disabled', 'true')
            this.trade.nativeElement.focus();
          } else {
            
            this.validationType = 'success';
            $('#js_save_update').removeAttr('disabled')
          }
        }
      )
  }

  //#region // send email

  drowTable(original, form, date) {
    let keys = Object.keys(form);
    let customDate = new Date(date);

    let modified = `<p>================ MODIFIED REQUEST ======================</p><table border=1 style="background-color:#daf4ff; border:1px solid black" bordercolor="#7767AB" cellpadding="2" cellspacing="0">`;

    let originalRequest = `<p>================ ORIGINAL REQUEST ======================</p><table border=1 style="background-color:#DAD4EE; border:1px solid black" bordercolor="#7767AB" cellpadding="2" cellspacing="0">`;

    

    for (let i = 0; i <= keys.length -1; i++) {
      modified += `<tr><td>${keys[i]}:</td><td style="${(form[keys[i]] != original[0][keys[i]]) ? 'color: red;' : 'color: black;'} ${(form[keys[i]] != original[0][keys[i]]) ? 'font-weight: bold' : 'font-weight: normal'}">${(form[keys[i]] == null) ? '' : form[keys[i]]}</td></tr>`;

      originalRequest += `<tr><td>${keys[i]}:</td><td>${(original[0][keys[i]] == null) ? '' : original[0][keys[i]]}</td></tr>`;

      if (i == keys.length -1) {
        modified += `<tr><td>Created By</td> <td>${localStorage.getItem('username')} ${customDate.toLocaleDateString('en-US')}</td> </tr></table>`;
        
        originalRequest += `<tr><td>Created By</td><td>${localStorage.getItem('username')} ${customDate.toLocaleDateString('en-US')}</td></tr></table>`;
      }
    }

    let mail = modified + originalRequest

    return mail.replace(/&/g, "%26").replace(/#/g, "%23");
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
          this.customerRequestForm.reset();
          this.customerRequestForm.get('BranchCode').setValue(localStorage.getItem('branchCode')); 
          this.customerRequestForm.get('ServerCode').setValue(localStorage.getItem('branchCode'));
          this.customerRequestForm.get('CreditLimit').setValue("0");
          this.validationType = ''; 
          this.isNew = 'A';    
        }

        clearInterval(isReset);
      }
    }, 100);

    // check objID
    const isNewForm = setInterval(() => {
      if (typeof (changes.objID) == 'undefined') {
        null;
      } else {
        this.objID = changes.objID.currentValue;
        this.isNew = (this.objID == 339) ? "A" : "U";        

        clearInterval(isNewForm);
      }
    }, 100);    

    // check delete record
    const isDelete = setInterval(() => {
      if (typeof (changes.isDelete) == 'undefined') {
        null;
      } else {
        this.isDelete = changes.isDelete.currentValue;

        if (this.isDelete) {
          let data = this.customerRequestForm.value;

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
          let RequestNum = this.customerRequestForm.get('RequestNum').value;
          let data = this.customerRequestForm.value;
          let date = new Date(this.customerRequestForm.get('RequestDate').value);

          let branchCode = localStorage.getItem('branchCode');
          let serverCode = localStorage.getItem('branchCode'); 
          
          let system = JSON.parse(localStorage.getItem("systemVariables"))

          data.RequestDate = this.formatDate(this.customerRequestForm.get('RequestDate').value);
          data.IsAddition = (this.objID == 339) ? 1 : 0;
          data.PersonType = 1;

          (this.objID == 339) && delete data.PersonCode; // delete customer prop if add new form
          if (this.objID == 340) {data.Branch = system[0].Glb_Branch_Name;}

        if (RequestNum == null || RequestNum == '') { // if new          
            let num;

            this.service.getMaxNumOfRecords("PersonsRequests", "BrnSerial", `BranchCode=%27${branchCode}%27%20And%20IsAddition=${data.IsAddition}`).toPromise()
              .then(res => {
                num = res;
                this.customerRequestForm.get('BrnSerial').setValue(num + 1);

                data.RequestNum = `${branchCode}${serverCode}${this.isNew}${num + 1}`;                               
                data.BrnSerial = num + 1; 
                              
                this.returnData.emit(data);
                
              })
              .catch(err => this.showNotification("err", this.lang.genericErrMsgTitle, err));
          } else { // if update
            let mail = this.drowTable(this.selectedData, this.customerRequestForm.value, date); 
            this.returnEmail.emit(mail);
            this.returnData.emit(data);  
          }                   
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
          this.returnID.emit(this.customerRequestForm.get('RequestNum').value);
        }

        clearInterval(isReporting);
      }
    }, 100);
  }   

}
