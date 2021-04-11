import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatabindingService } from 'src/services/databinding.service';
import * as lang from './../../../../../settings/lang';

@Component({
  selector: 'app-payment-terms',
  templateUrl: './payment-terms.component.html',
  styleUrls: ['./payment-terms.component.css']
})
export class PaymentTermsComponent implements OnInit, OnChanges {
  // form var
  paymentTermsForm: FormGroup;
  lang;

  // extchange data between parent and child
  @Input('data') data = [];
  @Input('isReset') isReset = false;
  @Input('isDelete') isDelete = false;
  @Input('isSaveOrUpdate') isSaveOrUpdate = false;
  @Input('isReporting') isReporting = false;
  @Output('returnData') returnData : EventEmitter<any> = new EventEmitter();
  @Output('returnID') returnID : EventEmitter<any> = new EventEmitter();  

  constructor(private fb: FormBuilder, private binding: DatabindingService) { }

  ngOnInit() {
    this.paymentTermsForm = this.fb.group({
      Terms: [""],
      CreditFor: [""],
      CreditForComm: [""],
      Prepayment: [""],
      CashOnDelivery: [""],
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

    // check lang

    getLang() {
      return localStorage.getItem('lang');
    }  

  //#endregion

  //#region 

    // deal with length of data recived from search component
    // Mohammed Hamouda - 30/12/2020

    displayData(data: any) {
      this.paymentTermsForm.get('Terms').setValue(data[0].Terms);
      this.paymentTermsForm.get('CreditFor').setValue(data[0].CreditFor);
      this.paymentTermsForm.get('CreditForComm').setValue(data[0].CreditForComm);
      this.paymentTermsForm.get('Prepayment').setValue(data[0].Prepayment);
      this.paymentTermsForm.get('CashOnDelivery').setValue(data[0].CashOnDelivery);
      this.paymentTermsForm.get('Notes').setValue(data[0].Notes);

      document.getElementById('Terms').setAttribute('disabled', 'true');
    }

  //#endregion 
  
  //#region 

    // return data from form as an arry
    // Mohammed Hamouda => v1

    returnArrayFromFormValues() {
      let data = [];
      data.push(["Terms", this.paymentTermsForm.get("Terms").value]);
      data.push(["CreditFor", this.paymentTermsForm.get("CreditFor").value]);
      data.push(["CreditForComm", this.paymentTermsForm.get("CreditForComm").value]);
      data.push(["Prepayment", this.paymentTermsForm.get("Prepayment").value]);
      data.push(["CashOnDelivery", this.paymentTermsForm.get("CashOnDelivery").value]);
      data.push(["Notes", (this.paymentTermsForm.get("Notes").value == null) ? "" : this.paymentTermsForm.get("Notes").value]);
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
          this.paymentTermsForm.reset();
          document.getElementById('Terms').removeAttribute('disabled');        
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

          document.getElementById('Terms').removeAttribute('disabled');
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
          this.returnID.emit(this.paymentTermsForm.get('Terms').value);
        }

        clearInterval(isReporting);
      }
    }, 100);
  }

}
