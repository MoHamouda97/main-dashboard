import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-costing-items',
  templateUrl: './costing-items.component.html',
  styleUrls: ['./costing-items.component.css']
})
export class CostingItemsComponent implements OnInit, OnChanges {
  // form var
  costItemsForm: FormGroup;

  // extchange data between parent and child
  @Input('data') data = [];
  @Input('costItems') costItems = [];
  @Input('isReset') isReset = false;
  @Input('isDelete') isDelete = false;
  @Input('isSaveOrUpdate') isSaveOrUpdate = false;
  @Input('isReporting') isReporting = false;
  @Output('returnData') returnData : EventEmitter<any> = new EventEmitter();
  @Output('returnID') returnID : EventEmitter<any> = new EventEmitter();

  // loading cost items va
  isDbLoading = true;  

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.costItemsForm = this.fb.group({
      CostCode: [""],
      CostName: [""],
      AffectPrice: [null],
      CostType: [""],
    });
  }

  //#region 

    // check lang

    getLang() {
      return localStorage.getItem('lang');
    }  

  //#endregion
  
  //#region 

    // deal with length of data recived from search component
    // Mohammed Hamouda - 30/12/2020

    displayData(data: any) {
      this.costItemsForm.get('CostCode').setValue(data[0].CostCode);
      this.costItemsForm.get('CostName').setValue(data[0].CostName);
      this.costItemsForm.get('AffectPrice').setValue((data[0].AffectPrice == 1) ? true : false);
      this.costItemsForm.get('CostType').setValue(data[0].CostType);

      document.getElementById('CostCode').setAttribute('disabled', 'true');
    }

  //#endregion
  
  //#region 

    // return data from form as an arry
    // Mohammed Hamouda => v1

    returnArrayFromFormValues() {
      let data = [];
      data.push(["CostCode", this.costItemsForm.get("CostCode").value]);
      data.push(["CostName", this.costItemsForm.get("CostName").value]);
      data.push(["AffectPrice", (this.costItemsForm.get("AffectPrice").value == true) ? 1 : 0]);
      data.push(["CostType", this.costItemsForm.get("CostType").value]);
      return data;
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

    // check cost items data
    const isCostItems = setInterval(() => {
      if (typeof (changes.costItems) == 'undefined') {
        null;
      } else {
        this.costItems = changes.costItems.currentValue;
        this.isDbLoading = false;
        clearInterval(isCostItems);
      }
    }, 100);
    
    // check new record
   const isReset = setInterval(() => {
      if (typeof (changes.isReset) == 'undefined') {
        null;
      } else {
        this.isReset = changes.isReset.currentValue;

        if (this.isReset) {
          this.costItemsForm.reset();
          document.getElementById('CostCode').removeAttribute('disabled');        
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

          document.getElementById('CostCode').removeAttribute('disabled');
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
          this.returnID.emit(this.costItemsForm.get('CostCode').value);
        }

        clearInterval(isReporting);
      }
    }, 100);
  }   

}
