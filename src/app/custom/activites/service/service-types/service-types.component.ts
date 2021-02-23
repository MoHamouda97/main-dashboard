import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-service-types',
  templateUrl: './service-types.component.html',
  styleUrls: ['./service-types.component.css']
})
export class ServiceTypesComponent implements OnInit, OnChanges {
  // form var
  serviceTypesForm: FormGroup;

  // extchange data between parent and child
  @Input('data') data = [];
  @Input('isReset') isReset = false;
  @Input('isDelete') isDelete = false;
  @Input('isSaveOrUpdate') isSaveOrUpdate = false;
  @Input('isReporting') isReporting = false;
  @Output('returnData') returnData : EventEmitter<any> = new EventEmitter();
  @Output('returnID') returnID : EventEmitter<any> = new EventEmitter();  

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.serviceTypesForm = this.fb.group({
      ServiceTypeCode: [""],
      ServiceType: [""],
      Notes: [""],
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
      this.serviceTypesForm.get('ServiceTypeCode').setValue(data[0].ServiceTypeCode);
      this.serviceTypesForm.get('ServiceType').setValue(data[0].ServiceType);
      this.serviceTypesForm.get('Notes').setValue(data[0].Notes);

      document.getElementById('ServiceTypeCode').setAttribute('disabled', 'true');
    }

  //#endregion 
  
  //#region 

    // return data from form as an arry
    // Mohammed Hamouda => v1

    returnArrayFromFormValues() {
      let data = [];
      data.push(["ServiceTypeCode", this.serviceTypesForm.get("ServiceTypeCode").value]);
      data.push(["ServiceType", this.serviceTypesForm.get("ServiceType").value]);
      data.push(["Notes", (this.serviceTypesForm.get("Notes").value == null) ? "" : this.serviceTypesForm.get("Notes").value]);
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
    
    // check new record
   const isReset = setInterval(() => {
      if (typeof (changes.isReset) == 'undefined') {
        null;
      } else {
        this.isReset = changes.isReset.currentValue;

        if (this.isReset) {
          this.serviceTypesForm.reset();
          document.getElementById('ServiceTypeCode').removeAttribute('disabled');        
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

          document.getElementById('ServiceTypeCode').removeAttribute('disabled');
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
          this.returnID.emit(this.serviceTypesForm.get('ServiceTypeCode').value);
        }

        clearInterval(isReporting);
      }
    }, 100);
  }  
}
