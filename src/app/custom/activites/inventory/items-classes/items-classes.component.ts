import {Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { DatabindingService } from 'src/services/databinding.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FrmService } from 'src/services/frm/frm.service';
import * as lang from './../../../../../settings/lang';

@Component({
  selector: 'app-items-classes',
  templateUrl: './items-classes.component.html',
  styleUrls: ['./items-classes.component.css']
})
export class ItemsClassesComponent implements OnInit, OnChanges {
  // form var
  itemsClassesForm: FormGroup;
  lang;

  // extchange data between parent and child
  isData = false;
  @Input('search') search;
  @Input('vendors') vendors: any[] = [];
  @Input('isReset') isReset = false;
  @Input('isDelete') isDelete = false;
  @Input('isSaveOrUpdate') isSaveOrUpdate = false;
  @Input('isReporting') isReporting = false;
  @Output('returnData') returnData : EventEmitter<any> = new EventEmitter();
  @Output('returnID') returnID : EventEmitter<any> = new EventEmitter();

  // combo box obj  
  isVendorDisabled = false;
  isVisible = false;
  data = [];
  tblData = [];
  original = [];
  @ViewChild('value', {static: true}) comboValue: ElementRef;

  constructor(
    private binding: DatabindingService,  
    private fb: FormBuilder) { }

  ngOnInit() {
    this.itemsClassesForm = this.fb.group({
      ClassID: [""],
      ItemClass: [""],
      VendCode: [""],
      VendorName: [""],
      Notes: [""],
    }); 

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

    this.data = []
  }

  //#region 

    // display data recived from parent at the form
    // Mohammed Hamouda - 30/12/2020

    displayData(data: any) {
      this.itemsClassesForm.get('ClassID').setValue(data[0].ClassID);
      this.itemsClassesForm.get('ItemClass').setValue(data[0].ItemClass);
      this.itemsClassesForm.get('VendCode').setValue(data[0].VendCode);
      this.itemsClassesForm.get('VendorName').setValue(data[0].VendorName);
      this.itemsClassesForm.get('Notes').setValue(data[0].Notes); 

      document.getElementById('ClassID').setAttribute('disabled', 'true');
      this.isVendorDisabled = true;
    }  

  //#endregion

  //#region 

    // check lang

    getLang() {
      return localStorage.getItem('lang');
    }  

  //#endregion

  //#region 

    // get value from drop down (combo box)
    // Mohammed Hamouda => 5/1/2021 - v1

    getValFromDropDown(index) {
      this.itemsClassesForm.get('VendCode').setValue(this.vendors[index].VendorCode);
      this.itemsClassesForm.get('VendorName').setValue(this.vendors[index].VendorName);
    }

  //#endregion

  //#region 

    // search in vendors when user typing
    // Mohammed Hamouda - 12/01/2021

    searchParent(val) {
      let searchResult: any = this.vendors.filter(p => p.VendorCode.toLowerCase() == val.toLowerCase());

      if (searchResult.length > 0) {
        this.itemsClassesForm.get("VendorName").setValue(searchResult[0].VendorName);
      } else {
        this.itemsClassesForm.get("VendorName").setValue("");
      }
    }

    checkIsHaveVal() {
      let value = this.itemsClassesForm.get("VendorName").value;
      if (value == '') {
        this.binding.showMessage("validValue")
        this.comboValue.nativeElement.focus();
      }      
    }

  //#endregion

  //#region 

    // modal functions
    // Mohammed Hamouda - 03/14/2021

    showVindors() {
      this.isVisible = true;
    }  
    
    onItemClicked(index) {
      this.itemsClassesForm.get('VendCode').setValue(this.tblData[index].VendorCode);
      this.itemsClassesForm.get("VendorName").setValue(this.tblData[index].VendorName);
      this.isVisible = false;
    }

    // this function is used to recive data from table pagination
    tblPageChangeHandler(data){
      this.tblData = data;
    }   
  
    filterData(key, val) {  // filter

      (val == '') 
        ? this.vendors = this.original
        : this.vendors = this.vendors.filter(d => d[key].toString().toLocaleLowerCase().trim().includes(val.toLocaleLowerCase().trim()));
    } 

    reset() { // reset data  
      this.vendors = this.original;
    }     
    
    handleCancel() {
      this.isVisible = false;
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
      if (typeof (changes.search) == 'undefined') {
        null;
      } else {
        let data: any = changes.search.currentValue;    
        (data.length == 1) ? this.displayData(data) : null;
        clearInterval(isChanged);
      }
    }, 100);

    // check vendor data
    const isVendors = setInterval(() => {
      if (typeof (changes.vendors) == 'undefined') {
        null;
      } else {
        this.vendors = changes.vendors.currentValue; 
        this.data = this.vendors;   
        this.original = this.vendors;  
        this.isData = true;  
        clearInterval(isVendors);
      }
    }, 100);    
    
    // check new record
    const isReset = setInterval(() => {
      if (typeof (changes.isReset) == 'undefined') {
        null;
      } else {
        this.isReset = changes.isReset.currentValue;                
        if (this.isReset) {
          this.itemsClassesForm.reset();

          this.isVendorDisabled = false;

          document.getElementById('ClassID').removeAttribute('disabled');          
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
          this.returnData.emit(this.itemsClassesForm.value);

          document.getElementById('ClassID').removeAttribute('disabled');
          this.isVendorDisabled = false;
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
          this.returnData.emit(this.itemsClassesForm.value);
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
          this.returnID.emit(this.itemsClassesForm.get('ClaassID').value);
        }

        clearInterval(isReporting);
      }
    }, 100); 
  }

}
