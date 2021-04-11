import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatabindingService } from 'src/services/databinding.service';
import { FrmService } from 'src/services/frm/frm.service';
import * as lang from './../../../../../../settings/lang';

@Component({
  selector: 'bills-u-form',
  templateUrl: './bills-u-form.component.html',
  styleUrls: ['./bills-u-form.component.css']
})
export class BillsUFormComponent implements OnInit, OnChanges {
  // data from parent
  @Input('formData') formData = [];
  @Input('vendorsData') vendorsData = [];
  @Input('costCentersData') costCentersData = [];
  @Input('buyerData') buyerData = [];
  @Input('termsData') termsData = [];

  // send data to parent
  @Output('returnFormVal') returnFormVal : EventEmitter<any> = new EventEmitter();

  // for track validatable values  
  @ViewChild('vendors', {static: false}) vendors: ElementRef; 
  @ViewChild('centers', {static: false}) centers: ElementRef;
  @ViewChild('buyer', {static: false}) buyer: ElementRef;
  @ViewChild('terms', {static: false}) terms: ElementRef;   

  // form var
  billsForm: FormGroup;

  // popup data
  data: any = [];
  popupData: any = [];
  tblData: any = [];
  original: any = [];
  popupType: string = '';
  pouppTitle: string = '';
  pmtData: any = [];

  // visibility
  isShowForm: boolean = true;
  isVisible: boolean = false;
  
  // lang
  lang: any = [];

  // system
  system = JSON.parse(localStorage.getItem('systemVariables')); 
  
  constructor(private fb: FormBuilder, private service: FrmService, private binding: DatabindingService) { }

  ngOnInit() {
    this.billsFormGenerator();
    this.detectFormChange();
    this.getCurrentDate();

    // responding to language change
    this.binding.checkIsLangChanged.subscribe(
      res => {
        if (res != null) {
          this.lang = (res == 'EN') ? lang.en : lang.ar;
        }              
      }
    );

    this.lang = (localStorage.getItem('lang') == 'EN') ? lang.en : lang.ar;    
  }

  //#region 

    // check lang

    getLang() {
      return localStorage.getItem('lang');
    }  

  //#endregion   

  //#region // working with date

    // get current date
    getCurrentDate() { // get server date
      this.service.getCurrentDate("MM/dd/yyyy").toPromise()
        .then(res => {
          this.billsForm.get('BillDate').setValue(<string>res);
        })
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

  //#region // deal with form

    // Mohammed Hamouda - 07/04/2021

    billsFormGenerator() { // form generator
      this.billsForm = this.fb.group({
        Amount: [''],
        Bill: [''],
        BillDate: [''],
        BillNum: [''],
        BranchCode: [localStorage.getItem("branchCode")],
        BrnSerial: [''],
        BuyerCode: [this.system[1]["DefBuyer"]],
        CenterCode: [''],
        CenterName: [''],
        ChangeRate: [''],
        CurrencyCode: [''],
        CurrencyName: [''],
        InvNum: [''],
        IsCredit: [true],
        IssuedBy: [''],
        ModifiedBy: [localStorage.getItem("username")],
        Notes: [''],
        RequestNum: [''],
        Restricted: [true],
        ServerCode: [localStorage.getItem("branchCode")],
        Terms: [this.system[1]["DefTerms"]],
        TransCode: [''],
        VendCode: [''],
        VendName: ['']
      });
    }

    detectFormChange() {
      this.billsForm.valueChanges.subscribe(
        result => this.returnFormVal.emit(result)
      )
    }

  //#endregion

  //#region 

    // deal with length of data recived from search component
    // Mohammed Hamouda - 09/02/2021

    displayData(formData: any) {
      this.billsForm.get('Amount').setValue(formData[0]['Amount']);
      this.billsForm.get('Bill').setValue(formData[0]['Bill']);
      this.billsForm.get('BillDate').setValue(formData[0]['BillDate']);
      this.billsForm.get('BillNum').setValue(formData[0]['BillNum']);
      this.billsForm.get('BranchCode').setValue(formData[0]['BranchCode']);
      this.billsForm.get('BrnSerial').setValue(formData[0]['BrnSerial']);
      this.billsForm.get('BuyerCode').setValue(formData[0]['BuyerCode']);
      this.billsForm.get('CenterCode').setValue(formData[0]['CenterCode']);
      this.billsForm.get('CenterName').setValue(formData[0]['CenterName']);
      this.billsForm.get('ChangeRate').setValue(formData[0]['ChangeRate']);
      this.billsForm.get('CurrencyCode').setValue(formData[0]['CurrencyCode']);
      this.billsForm.get('CurrencyName').setValue(formData[0]['CurrencyName']);
      this.billsForm.get('InvNum').setValue(formData[0]['InvNum']);
      this.billsForm.get('IsCredit').setValue((formData[0]['IsCredit'] == 0) ? false : true);
      this.billsForm.get('IssuedBy').setValue(formData[0]['IssuedBy']);
      this.billsForm.get('ModifiedBy').setValue(formData[0]['ModifiedBy']);
      this.billsForm.get('Notes').setValue(formData[0]['Notes']);
      this.billsForm.get('RequestNum').setValue(formData[0]['RequestNum']);
      this.billsForm.get('Restricted').setValue((formData[0]['Restricted'] == 0) ? false : true);
      this.billsForm.get('ServerCode').setValue(formData[0]['ServerCode']);
      this.billsForm.get('Terms').setValue(formData[0]['Terms']);
      this.billsForm.get('TransCode').setValue(formData[0]['TransCode']);
      this.billsForm.get('VendCode').setValue(formData[0]['VendCode']);
      this.billsForm.get('VendName').setValue(formData[0]['VendName']);
    }    
  //#endregion

  //#region 

    // deal with modal
    // Mohammed Hamouda - 03/15/2021

    fillPopUp (index, type) {
      this.popupType = type;

      if (index == 0) {
        this.data = this.vendorsData;        
        this.pouppTitle = 'Vendors';
      } else if (index == 1) {
        this.data = this.costCentersData;
        this.pouppTitle = 'Cost Centers';
      } else if (index == 2) {
        this.data = this.buyerData;
        this.pouppTitle = 'Buyer';
      } else if (index == 3) {
        this.data = this.termsData;
        this.pouppTitle = 'Payment Terms';
      } else if (index == 4) {
        this.data = [];
        this.pouppTitle = 'PMT #';
      }

      this.original = this.data;
      this.isVisible = true; 
    }

    tblPageChangeHandler(data){
      this.tblData = data;
    } 

    onItemClicked(index) {  

      switch(this.popupType) {
        case 'Vendors' :
          this.billsForm.get('CenterCode').setValue(this.tblData[index]['CenterCode']);
          this.billsForm.get('CenterName').setValue(this.tblData[index]['CenterName']);
          this.billsForm.get('ChangeRate').setValue(this.tblData[index]['ChangeRate']);
          this.billsForm.get('CurrencyCode').setValue(this.tblData[index]['CurrencyCode']);
          this.billsForm.get('CurrencyName').setValue(this.tblData[index]['CurrencyName']);
          this.billsForm.get('VendCode').setValue(this.tblData[index]['PersonCode']);
          this.billsForm.get('VendName').setValue(this.tblData[index]['PersonName']);
          break;
        case 'CostCenter' :
          this.billsForm.get('CenterCode').setValue(this.tblData[index]['CenterCode']);
          this.billsForm.get('CenterName').setValue(this.tblData[index]['CenterName']);
          break; 
        case 'Buyer' :
          this.billsForm.get('BuyerCode').setValue(this.tblData[index]['PersonCode']);
          break;  
        case 'Payment' :
          this.billsForm.get('Terms').setValue(this.tblData[index]['Terms']);
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

  //#endregion

  //#region 

    // check if control has correct value in blur event

    checkIsHaveVal(type) {
      let value;

      switch(type) {
        case 'vendors' :
          value = this.billsForm.get('VendCode').value;
          let vendorObj = this.vendorsData.filter(v => v.PersonCode == value);

          if (value != "" && vendorObj.length == 0) {
            this.binding.showMessage("validValue");
            this.vendors.nativeElement.focus();
            return
          } 
          
          if (vendorObj.length > 0) {
            this.billsForm.get('VendCode').setValue(vendorObj[0]['PersonCode']); 
            this.billsForm.get('VendName').setValue(vendorObj[0]['PersonName']);
          }

          if (value == '')
            this.billsForm.get('VendName').setValue('');
          break;
        case 'centers' :
          value = this.billsForm.get('CenterName').value;
          let centerObj = this.costCentersData.filter(c => c.CenterName == value);

          if (value != "" && centerObj.length == 0) {
            this.binding.showMessage("validValue");
            this.centers.nativeElement.focus();
            return
          } 
          
          if (centerObj.length > 0) {
            this.billsForm.get('CenterName').setValue(centerObj[0]['CenterName']); 
            this.billsForm.get('CenterCode').setValue(centerObj[0]['CenterCode']);
          }
          break;
        case 'buyer' :
          value = this.billsForm.get('BuyerCode').value;
          let buyerObj = this.buyerData.filter(b => b.PersonCode == value);

          if (value != "" && buyerObj.length == 0) {
            this.binding.showMessage("validValue");
            this.buyer.nativeElement.focus();
            return
          } 
          
          if (buyerObj.length > 0) {
            this.billsForm.get('BuyerCode').setValue(buyerObj[0]['PersonCode']); 
          }
          break; 
        case 'terms' :
          value = this.billsForm.get('Terms').value;
          let termObj = this.termsData.filter(t => t.Terms == value);

          if (value != "" && termObj.length == 0) {
            this.binding.showMessage("validValue");
            this.terms.nativeElement.focus();
            return
          } 
          
          if (termObj.length > 0) {
            this.billsForm.get('Terms').setValue(termObj[0]['Terms']); 
          }
          break;                             
      }
    }

  //#endregion

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { // stop calling filpup function when click enter
    if (event.key === 'Enter') {
      event.preventDefault();
      return
    }
  }  

  ngOnChanges(changes: SimpleChanges) {
    // check new data
    const isChanged = setInterval(() => {
      if (typeof (changes.formData) == 'undefined') {
        null;
      } else {
        this.formData = changes.formData.currentValue;
        (this.formData.length > 0) && this.displayData(this.formData);        
        clearInterval(isChanged);
      }
    }, 100); 

    const newVendor = setInterval(() => {
      if (typeof (changes.vendorsData) == 'undefined') {
        null;
      } else {
        this.vendorsData = changes.vendorsData.currentValue;      
        clearInterval(newVendor);
      }
    }, 100);
    
    const newCostCenter = setInterval(() => {
      if (typeof (changes.costCentersData) == 'undefined') {
        null;
      } else {
        this.costCentersData = changes.costCentersData.currentValue;     
        clearInterval(newCostCenter);
      }
    }, 100);
    
    const newBuyerData = setInterval(() => {
      if (typeof (changes.buyerData) == 'undefined') {
        null;
      } else {
        this.buyerData = changes.buyerData.currentValue;         
        clearInterval(newBuyerData);
      }
    }, 100);
    
    const newTermsData = setInterval(() => {
      if (typeof (changes.termsData) == 'undefined') {
        null;
      } else {
        this.termsData = changes.termsData.currentValue;      
        clearInterval(newTermsData);
      }
    }, 100);    
        
  }  

}
