import {Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
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
  @Input('data') data = [];
  @Input('vendors') vendors = [];
  @Input('isReset') isReset = false;
  @Input('isDelete') isDelete = false;
  @Input('isSaveOrUpdate') isSaveOrUpdate = false;
  @Input('isReporting') isReporting = false;
  @Output('returnData') returnData : EventEmitter<any> = new EventEmitter();
  @Output('returnID') returnID : EventEmitter<any> = new EventEmitter();

  // vars for handling user ability to select data or adding data
  isDisabled = false;
  isParentDisabled = false;

  // combo box obj
  isVendorDisabled = false;

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
  }

  //#region 

    // display data recived from parent at the form
    // Mohammed Hamouda - 30/12/2020

    displayData(data: any) {
      this.itemsClassesForm.get('CenterCode').setValue(data[0].CenterCode);
      this.itemsClassesForm.get('CenterName').setValue(data[0].CenterName);
      this.itemsClassesForm.get('CenterParent').setValue(data[0].CenterParent);
      this.itemsClassesForm.get('parentname').setValue(data[0].ParentName);
      this.itemsClassesForm.get('CenterLevel').setValue(data[0].CenterLevel); 

      document.getElementById('ClassID').setAttribute('disabled', 'true');
      document.getElementById('VendCode').removeAttribute('disabled');
      this.isDisabled = false;
    }  

  //#endregion

  //#region 

    // check lang

    getLang() {
      return localStorage.getItem('lang');
    }  

  //#endregion

  //#region 

    // return data from form as an arry
    // Mohammed Hamouda => v1

    returnArrayFromFormValues() {
      let data = [];
      data.push(["ClassID", this.itemsClassesForm.get("ClassID").value]);
      data.push(["ItemClass", this.itemsClassesForm.get("ItemClass").value]);
      data.push(["VendCode", this.itemsClassesForm.get("VendCode").value]);
      data.push(["Notes", this.itemsClassesForm.get("Notes").value]);
      return data;
    }

  //#endregion

  //#region 

    // get value from drop down (combo box)
    // Mohammed Hamouda => 5/1/2021 - v1

    /*getValFromDropDown(index) {
      this.itemsClassesForm.get('CenterParent').setValue(this.parents[index].CenterCode);
      this.itemsClassesForm.get('parentname').setValue(this.parents[index].CenterName);
      this.itemsClassesForm.get('CenterLevel').setValue(parseInt(this.parents[index].CenterLevel) + 1)
    }*/

  //#endregion


  //#region 

    // search in vendors when user typing
    // Mohammed Hamouda - 12/01/2021

    searchParent(val) {
      let searchResult: any = this.vendors.filter(p => p.VendorCode.toLowerCase() == val.toLowerCase());
      console.log(searchResult);
      if (searchResult.length > 0) {
        this.itemsClassesForm.get("VendorName").setValue(searchResult[0].VendorName);
      } else {
        this.itemsClassesForm.get("VendorName").setValue("");
      }
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

    // check vendor data
    const isVendors = setInterval(() => {
      if (typeof (changes.vendors) == 'undefined') {
        null;
      } else {
        this.vendors = changes.vendors.currentValue;        
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

          this.isParentDisabled = false;

          document.getElementById('ClaassID').removeAttribute('disabled');
          document.getElementById('VendCode').removeAttribute('disabled');          
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
          this.returnData.emit(this.returnArrayFromFormValues());

          document.getElementById('ClaassID').removeAttribute('disabled');
          document.getElementById('VendCode').removeAttribute('disabled');
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
          this.returnData.emit(this.returnArrayFromFormValues());
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
