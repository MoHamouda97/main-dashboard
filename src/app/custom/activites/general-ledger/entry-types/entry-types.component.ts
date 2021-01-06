import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatabindingService } from 'src/services/databinding.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as lang from './../../../../../settings/lang';
import { FrmService } from 'src/services/frm/frm.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as $ from 'jquery';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-entry-types',
  templateUrl: './entry-types.component.html',
  styleUrls: ['./entry-types.component.css']
})
export class EntryTypesComponent implements OnInit, OnDestroy {
  entryTypesForm: FormGroup;
  lang;
  data;
  searchSubscription: Subscription;
  dataResetSubscription: Subscription;

  isVisible = false;

  private unsubscribe$: Subject<any> = new Subject<any>();

  constructor(    
    private binding: DatabindingService, 
    private service: FrmService, 
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.entryTypesForm = this.fb.group({
      TransCode: [null, [Validators.required]],
      TransName: [null, [Validators.required]],
      Notes: [null],
    });  
    
    //#region 

        // dealing with page direction
        // Mohammed Hamouda - 29/12/2020 => v1 (detect language changing)

        this.binding.checkIsLangChanged.subscribe(
          res => {
            if (res != null)
              this.lang = (res == 'EN') ? lang.en : lang.ar;
          }
        );

        this.lang = (localStorage.getItem('lang') == 'EN') ? lang.en : lang.ar;

    //#endregion
    
    //#region 

        // recive data from search component
        // Mohammed Hamouda - 30/12/2020 => v1 (detect when search data send data)

        this.binding.checkSendingDataFromSearch.pipe(
          takeUntil(this.unsubscribe$)
        ).subscribe(
          res => {
            if (res != null) {
              if (res.length > 0) {
                this.binding.enableFunctions(true);
                (res.length == 1) ? this.ifLenghtIsOne(res) : this.ifLengthIsMore(res);
              }                
              else 
                this.arabicOrEnglishMessage(localStorage.getItem('lang'));  
            }
              
          }
        );


    //#endregion 
    
    //#region 

        // responding to task bar
        // Mohammed Hamouda - 31/12/2020 => v1 (detect when task bar did an action)

        this.binding.checkDataReset.pipe(
          takeUntil(this.unsubscribe$)
        ).subscribe(
          res => {
            if (res != null) {
              this.entryTypesForm.reset();  
            }               
          }
        );

    //#endregion       
  }

  //#region 

    // deal with length of data recived from search component
    // Mohammed Hamouda - 30/12/2020

    ifLenghtIsOne(data: any) {
      this.entryTypesForm.get('TransCode').setValue(data[0].TransCode);
      this.entryTypesForm.get('TransName').setValue(data[0].TransName);
      this.entryTypesForm.get('Notes').setValue(data[0].Notes);
    }

    ifLengthIsMore(data) {
      this.data = data.map((val) => {
        return {
          TransCode: val.TransCode,
          TransName: val.TransName,
          System: val.System,
          IssuedBy: val.IssuedBy,
          Notes: val.Notes,
          DateCreated: `${new Date(val.DateCreated).toLocaleString("en-US", {timeZone: "America/New_York"})}`,
          DateModified: `${new Date(val.DateModified).toLocaleString("en-US", {timeZone: "America/New_York"})}`,
        }
      });

      this.isVisible = true;    
    }

    // check when user click a row  

    onItemClicked(id) {
      let filtredData = this.data.filter(d => d.TransCode == id)
      this.ifLenghtIsOne(filtredData);
      this.isVisible = false;
    }

    arabicOrEnglishMessage(lang) {
      let title = 'Search Result';
      let message = 'No Data for your Search';
      let options = {nzClass: 'lang-en'}

      if (lang == 'AR') {
        title = 'نتائج البحث';
        message = 'لا توجد بيانات لعملية البحث';
        options = {nzClass: 'lang-ar'}
      }

      this.notification.warning(title, message, options);
    }

  //#endregion 
  
  //#region 

    // close modal

    handleCancel(){this.isVisible = false}

  //#endregion

  //#region 

    // check lang

    getLang() {
      return localStorage.getItem('lang');
    }

  //#endregion  

  ngOnDestroy() {
    this.binding.enableFunctions(false);
  }

}
