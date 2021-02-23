import {Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { DatabindingService } from 'src/services/databinding.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as lang from './../../../../../settings/lang';
import { FrmService } from 'src/services/frm/frm.service';

@Component({
  selector: 'app-cost-centers',
  templateUrl: './cost-centers.component.html',
  styleUrls: ['./cost-centers.component.css']
})

export class CostCentersComponent implements OnInit, OnDestroy, OnChanges {
  // form var
  costCenterForm: FormGroup;
  lang;

  // extchange data between parent and child
  @Input('data') data = [];
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
  parents= [];

  constructor(
    private binding: DatabindingService, 
    private service: FrmService, 
    private fb: FormBuilder) { }
   

  ngOnInit() {
    this.costCenterForm = this.fb.group({
      CenterCode: [null],
      CenterName: [null],
      CenterParent: [null],
      parentname: [null],
      CenterLevel: [null],
      CenterIsFinal: [null]
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
 
    // get parents
    this.getParent();

  }

  //#region 

    // display data recived from parent at the form
    // Mohammed Hamouda - 30/12/2020

    displayData(data: any) {
      this.costCenterForm.get('CenterCode').setValue(data[0].CenterCode);
      this.costCenterForm.get('CenterName').setValue(data[0].CenterName);
      this.costCenterForm.get('CenterParent').setValue(data[0].CenterParent);
      this.costCenterForm.get('parentname').setValue(data[0].ParentName);
      this.costCenterForm.get('CenterLevel').setValue(data[0].CenterLevel); 

      document.getElementById('centercode').setAttribute('disabled', 'true');
      document.getElementById('parent').removeAttribute('disabled');
      this.isDisabled = false;
      
      if (data[0].NumberOfChildren > 0) {
        this.costCenterForm.get('CenterIsFinal').setValue((data[0].CenterIsFinal == 1) ? true : false);

        document.getElementById('parent').setAttribute('disabled', 'true');
        document.getElementById('centercode').setAttribute('disabled', 'true'); 
        
        this.isDisabled = true;
        this.isParentDisabled = true;
      } else {
        this.costCenterForm.get('CenterIsFinal').setValue(false);
        this.isDisabled = false;
        this.isParentDisabled = false;
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

    // call a function that reset form
    // Mohammed Hamouda => 4/1/2021 - v1

    resetForm() {
      this.isParentDisabled = false;
      this.isDisabled = false;
      
      this.costCenterForm.get('CenterCode').setValue("");
      this.costCenterForm.get('CenterName').setValue("");
      this.costCenterForm.get('CenterParent').setValue("");
      this.costCenterForm.get('parentname').setValue("");
      this.costCenterForm.get('CenterLevel').setValue("")
      this.costCenterForm.get('CenterLevel').setValue("");

      this.costCenterForm.get("CenterIsFinal").setValue(false);
    }   

  //#endregion

  //#region 

    // return data from form as an arry
    // Mohammed Hamouda => v1

    returnArrayFromFormValues() {
      let data = [];
      data.push(["CenterCode", this.costCenterForm.get("CenterCode").value]);
      data.push(["CenterName", this.costCenterForm.get("CenterName").value]);
      data.push(["CenterParent", this.costCenterForm.get("CenterParent").value]);
      data.push(["CenterLevel", this.costCenterForm.get("CenterLevel").value]);
      data.push(["CenterIsFinal", (this.costCenterForm.get("CenterIsFinal").value == true) ? 1 : 0]);
      return data;
    }

  //#endregion

  //#region
  
    // get parents
    // Mohammed Hamouda => 5/1/2021

    getParent() {
      this.service.getParents().subscribe(
        res => {
          let data: any = res;
          this.parents = JSON.parse(data);
        }
      )
    }
  
  //#endregion

  //#region 

    // get value from drop down (combo box)
    // Mohammed Hamouda => 5/1/2021 - v1

    getValFromDropDown(index) {
      this.costCenterForm.get('CenterParent').setValue(this.parents[index].CenterCode);
      this.costCenterForm.get('parentname').setValue(this.parents[index].CenterName);
      this.costCenterForm.get('CenterLevel').setValue(parseInt(this.parents[index].CenterLevel) + 1)
    }

  //#endregion

  //#region 

    // search in parent when user typing
    // Mohammed Hamouda - 10/1/2021

    searchParent(val) {
      let searchResult: any = this.parents.filter(p => p.CenterCode == val);
      if (searchResult.length > 0) {
        this.costCenterForm.get("parentname").setValue(searchResult[0].CenterName);
        this.costCenterForm.get("CenterLevel").setValue(parseInt(searchResult[0].CenterLevel) + 1);
      } else {
        this.costCenterForm.get("parentname").setValue("");
        this.costCenterForm.get("CenterLevel").setValue("");
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
    
    // check new record
    const isReset = setInterval(() => {
      if (typeof (changes.isReset) == 'undefined') {
        null;
      } else {
        this.isReset = changes.isReset.currentValue;                
        if (this.isReset) {
          this.resetForm();

          document.getElementById('parent').removeAttribute('disabled');
          document.getElementById('centercode').removeAttribute('disabled');          
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

          document.getElementById('parent').removeAttribute('disabled');
          document.getElementById('centercode').removeAttribute('disabled');
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
          this.returnID.emit(this.costCenterForm.get('CenterCode').value);
        }

        clearInterval(isReporting);
      }
    }, 100); 
  }

  ngOnDestroy() {    
  }
  
}
