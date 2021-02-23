import { Component, OnDestroy, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { DatabindingService } from 'src/services/databinding.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as lang from './../../../../settings/lang';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import * as $ from 'jquery';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-task-bar',
  templateUrl: './task-bar.component.html',
  styleUrls: ['./task-bar.component.css']
})
export class TaskBarComponent implements OnInit, OnDestroy, OnChanges {
  @Input('userRights') userRights;
  @Input('isAvailableReport') isAvailableReport = true;
  lang;
  isDisabled = true;
  isDelete = false;
  isEditOrAdd = false;
  isReport = false;

  canAdd = true;
  canBrowes = true;
  canEdit = true;
  canDelete = true;
  canPrint = true;

  addOrEdit = 'Add';

  subscription: Subscription;

  isNewTLoad = true;

  destroyed = new Subject();

  constructor(
    private binding: DatabindingService, 
    private notification: NzNotificationService, 
    private modal: NzModalService,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit() {

    //#region 

      // set user rights
      /*setTimeout(() => {
        this.canAdd = this.userRights.CanAdd;
        this.canBrowes = this.userRights.CanBrows;
        this.canEdit = this.userRights.CanEdit;
        this.canDelete = this.userRights.CanDelete;
        this.canPrint = this.userRights.CanPrint;
      }, 1000)*/

    //#endregion

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

        // enable functions
        // Mohammed Hamouda - 31/12/2020

        this.binding.checkEnable.subscribe(
          res => {
            (res != null && res != false) ? this.isDisabled = false : this.isDisabled = true;              
          }
        );

    //#endregion      
  
    //#region 

        // display messages
        // Mohammed Hamouda - 3/1/2021

        this.binding.checkMessage.pipe(takeUntil(this.destroyed)).subscribe(
          res => {
            if(res != null) {
              this.arabicOrEnglishMessageForCompleatedAction(localStorage.getItem("lang"), res);
            }              
          }
        );

    //#endregion  
    
    //#region 

        // check print 
        // Mohammed Hamouda - 4/1/2021

        this.binding.checkReport.subscribe(
          res => {
            if (res == null || res == false)
              this.isReport = false;
          }
        )

    //#endregion
  
  }

  //#region 

    // reset data

    resetData() {
      this.isDisabled = true;
      this.addOrEdit = 'Add';
      this.binding.resetData(true);
    }

  //#endregion

  //#region 

    // get all data

    getData() {
      this.binding.getAllData(true);
    }

  //#endregion 

  //#region 

    // get report

    getReport() {
      this.isReport = true;
      this.binding.getReport(true);
    }

  //#endregion

  //#region 

    // order delete

    delete() {
      this.isDelete = true;
      this.binding.deleteRecord(true);
    }

    checkDelete() {
      this.modal.confirm({
        nzTitle: this.lang.deleteConfirmTitle,
        nzCancelText: this.lang.cancel,
        nzOkText: this.lang.delete,
        nzOkType: 'danger',
        nzOnOk: () => {
          this.delete()
        },        
        nzClassName: (this.getLang() == 'AR') ? 'lang-ar' : 'lang-en'
      })
    }

  //#endregion   
  
  //#region 

    // check lang

    getLang() {
      return localStorage.getItem('lang');
    }

  //#endregion 
  
  //#region 

    // save & update function
    // Mohammed Hamouda - 4/1/2021

    saveOrUpdateMode() {
      this.isEditOrAdd = true;
      (this.addOrEdit == '') ? this.addOrEdit = 'Edit' : this.addOrEdit = "Add";
      this.binding.saveOrUpdate(this.addOrEdit);    
      this.addOrEdit == ''  
    }

  //#endregion

  //#region
  
    // display messages to the user after compleate action
    // Mohammed Hamouda => 4/41/2021

    arabicOrEnglishMessageForCompleatedAction(lang, type) {
      let title;
      let message;
      let notification;
      let options = (lang == 'EN') ? {nzClass: 'lang-en'} : {nzClass: 'lang-ar'};

      if (type != 'stopIcons') {
        switch (type) {
          case "delete" :
            title = this.lang.deleteMsgTitle;
            message = this.lang.deleteMsgDetails;
            notification = 'success';
            this.isDelete = false;
            break;
          case "edit" :
            title = this.lang.editMsgTitle;
            message = this.lang.editMsgDetails;
            notification = 'success';
            this.isEditOrAdd = false;
            break;
          case "edit2" :
            title = this.lang.editMsgTitle;
            message = this.lang.editMsgDetails;
            notification = 'success';
            this.isEditOrAdd = false;
            break;            
          case "add" :
            title = this.lang.addMsgTitle;
            message = this.lang.addMsgDetails;
            notification = 'success';
            this.isEditOrAdd = false;
            break;
          case "deleteTransType" :
            title = this.lang.deleteMsgTitle;
            message = this.lang.deleteTransTypeMsgDetails;
            notification = 'warning';
            this.isDelete = false;
            break;
          case "invalid" :
            title = this.lang.warningMsgTitle;
            message = this.lang.warningMsgDetails;
            notification = 'warning';
            this.isEditOrAdd = false;  
        }

        this.notification.create(notification, title, message, options);
      } else {
        this.isDelete = false;
        this.isEditOrAdd = false;
      }      
    } 

  //#endregion

  ngOnDestroy() {
    this.isDisabled = true;
    this.binding.getAllData(false);
    this.binding.deleteRecord(false);
    this.binding.getReport(false);
    this.binding.showMessage(null);
    this.binding.saveOrUpdate(null);   
    this.destroyed.next(true);
    this.destroyed.complete();  
  }

  ngOnChanges(changes: SimpleChanges) {
    // check new user rights
    const isUserRightsChanged = setInterval(() => {
      if (typeof (changes.userRights) == 'undefined') {
        null;
      } else {
        this.userRights = changes.userRights.currentValue;
        clearInterval(isUserRightsChanged);
      }
    }, 100);

    // check new data
    const isPrintChanged = setInterval(() => {
      if (typeof (changes.isAvailableReport) == 'undefined') {
        null;
      } else {
        this.isAvailableReport = changes.isAvailableReport.currentValue;
        clearInterval(isPrintChanged);
      }
    }, 100);    
  }

}
