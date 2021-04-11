import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class DatabindingService {
  //#region 
    
    // lang setting
    // Mohammed Hamouda - 28/12/2020
    private isLangChanged = new BehaviorSubject<string> (null);
    checkIsLangChanged = this.isLangChanged.asObservable();

    changeLang(changeLang) {
      this.isLangChanged.next(changeLang);
    }    

  //#endregion  

  //#region 

    // send data from search component to other component
    // Mohammed Hamouda - 30/12/2020

    private isSendingDataFromSearch = new BehaviorSubject<any> (null)
    checkSendingDataFromSearch = this.isSendingDataFromSearch.asObservable();

    sendingSearchData(data) {
      this.isSendingDataFromSearch.next(data);
    }

  //#endregion

  //#region 

    // handle task bar functions
    // Mohammed Hamouda - 31/12/2020

    // rest function
    private isDataReset = new BehaviorSubject<boolean> (null)
    checkDataReset = this.isDataReset.asObservable();

    resetData(isReset) {
      this.isDataReset.next(isReset);
    }

    // enable other functions
    private isEnabled = new BehaviorSubject<boolean> (null)
    checkEnable = this.isEnabled.asObservable();

    enableFunctions(isEnable) {
      this.isEnabled.next(isEnable);
    }

    // get all data
    private isAllData = new BehaviorSubject<boolean> (null)
    checkAllData = this.isAllData.asObservable();

    getAllData(cri) {
      this.isAllData.next(cri);
    }

    // delete record
    private isDelete = new BehaviorSubject<boolean> (null)
    checkDelete = this.isDelete.asObservable();

    deleteRecord(isDelete) {
      this.isDelete.next(isDelete);
    }

    // get reports
    private isReport = new BehaviorSubject<boolean> (null)
    checkReport = this.isReport.asObservable();

    getReport(isReport) {
      this.isReport.next(isReport);
    }

  //#endregion
  
  //#region 

    // handle messages
    // Mohammed Hamouda - 3/1/2021

    private isMessage = new BehaviorSubject<string> (null);
    checkMessage = this.isMessage.asObservable();

    showMessage(type) {
      this.isMessage.next(type);
    }

  //#endregion

  //#region 

    // handle save & update
    // Mohammed Hamouda - 4/1/2021

    public isSaveOrUpdate = new BehaviorSubject<string> (null);
    checkSaveOrUpdate = this.isSaveOrUpdate.asObservable();

    saveOrUpdate(type) {
      this.isSaveOrUpdate.next(type);
    }

  //#endregion 
  
  //#region 

    // get item removed from grid
    // Mohammed Hamouda - 23/02/2021

    public isItemRemoved = new BehaviorSubject<any> (null);
    checkItemRemoved = this.isItemRemoved.asObservable();

    itemRemoved(id) {
      this.isItemRemoved.next(id);
    }
    
    // get item to be updated from grid
    // Mohammed Hamouda - 24/02/2021

    public isItemUpdate = new BehaviorSubject<any> (null);
    checkItemUpdate = this.isItemUpdate.asObservable();

    itemUpdate(index) {
      this.isItemUpdate.next(index);
    }
    
    // updated item from grid
    // Mohammed Hamouda - 24/02/2021

    public updatedItem = new BehaviorSubject<any> (null);
    updatedItemValue = this.updatedItem.asObservable();

    sendUpdatedItem(item) {
      this.updatedItem.next(item);
    }
    
    // is auto tax
    // Mohammed Hamouda - 24/02/2021

    public isAutoTax = new BehaviorSubject<any> (null);
    autoTax = this.isAutoTax.asObservable();

    sendTax(tax) {
      this.isAutoTax.next(tax);
    }

    // is order completed
    // Mohammed Hamouda - 04/03/2021

    public isCompletedOredr = new BehaviorSubject<boolean> (null);
    completedOrder = this.isCompletedOredr.asObservable();

    checkCompletedOreder(isCompleted) {
      this.isCompletedOredr.next(isCompleted);
    }
    
    public orderStatus = new BehaviorSubject<any[]> (null);
    checkOrderStatus = this.orderStatus.asObservable();

    sendOrderStatus(orderStatus) {
      this.orderStatus.next(orderStatus);
    }    
    
  //#endregion

  constructor() { }

}
