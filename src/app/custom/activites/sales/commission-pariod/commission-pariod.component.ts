import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-commission-pariod',
  templateUrl: './commission-pariod.component.html',
  styleUrls: ['./commission-pariod.component.css']
})
export class CommissionPariodComponent implements OnInit, OnChanges {
  // form var
  comissionForm: FormGroup;

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
    this.comissionForm = this.fb.group({
      PeriodCode: [""],
      PeriodDescription: [""],
      StartDate: [""],
      EndDate: [""],
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
      this.comissionForm.get('PeriodCode').setValue(data[0].PeriodCode);
      this.comissionForm.get('PeriodDescription').setValue(data[0].PeriodDescription);
      this.comissionForm.get('StartDate').setValue(data[0].StartDate);
      this.comissionForm.get('EndDate').setValue(data[0].EndDate);

      document.getElementById('PeriodCode').setAttribute('disabled', 'true');
    }

  //#endregion

  //#region 

    // format date to SQL format
    // Mohammed Hamouda 11/01/2021

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
          this.comissionForm.reset();
          document.getElementById('PeriodCode').removeAttribute('disabled');        
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
          let data = this.comissionForm.value;
          data.StartDate = this.formatDate(this.comissionForm.get('StartDate').value);
          data.EndDate = this.formatDate(this.comissionForm.get('EndDate').value);

          this.returnData.emit(data);

          document.getElementById('PeriodCode').removeAttribute('disabled');
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
          let data = this.comissionForm.value;
          data.StartDate = this.formatDate(this.comissionForm.get('StartDate').value);
          data.EndDate = this.formatDate(this.comissionForm.get('EndDate').value);

          this.returnData.emit(data);
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
          this.returnID.emit(this.comissionForm.get('PeriodCode').value);
        }

        clearInterval(isReporting);
      }
    }, 100);
  }   

}
