import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-budget',
  templateUrl: './account-budget.component.html',
  styleUrls: ['./account-budget.component.css']
})
export class AccountBudgetComponent implements OnInit {

  // display
  isShowGrid: boolean = true;
  isAdd: boolean = true;
  gridData: any = []; 

  // years & months
  arrOfYears: number[] = [];
  arrOfMonths: number[] = [];

  constructor() { }

  ngOnInit() {
    this.initArrOfYearsAndMonths();
  }

  //#region 

    // check lang

    getLang() {
      return localStorage.getItem('lang');
    }  

  //#endregion
  
  //#region 

    // deal with grid
    // Mohammed Hamouda - 03/15/2021

    hideGrid() {
      this.isShowGrid = false;
      /*this.isValidItemCode = false;
      this.isValidQuantity = false;
      this.isAdd = true;*/
    }

    showGrid() {
      this.isShowGrid = true;
      //this.resetGridForm();
    }

    editGrid() {
      /*const {Cost, ID, Price, StoreCode, Trn_ID, ...rest} = this.gridVoucherForm.getRawValue();
      this.arrOfItems[this.indexOfItemToBeUpdated] = this.gridVoucherForm.getRawValue();

      const updatedItem: any[] = [this.indexOfItemToBeUpdated, rest]; 
      this.binding.sendUpdatedItem(updatedItem);*/

      this.isShowGrid = true;
    }

    addToGrid(item: any = {}, type = "new") {
      // add item to grid
      this.addRow(item);    

      // add item to arr of item
      this.addItemToArr(item);
      
      // reset form
      //this.resetGridForm();       
    }

    addRow(item: any = {}) {
      /*const {Cost, ID, Price, StoreCode, Trn_ID, ...rest} = this.gridVoucherForm.getRawValue();
  
      (Object.keys(item).length > 0) ? this.itemsRecived.push(rest)  : this.gridData = rest;*/
    } 

    addItemToArr(item: any = {}) {
      /*this.i++;    
      const isItem = (Object.keys(item).length > 0) ? true : false;
  
      const addProp = (!isItem) ? this.gridVoucherForm.getRawValue() : item;
      addProp.id = this.i;
  
      this.arrOfItems = [
        ...this.arrOfItems,
        addProp      
      ];   
  
       // num of items on grid
       this.header.gridrowlnum = this.arrOfItems.length;
  
       // remove first object from array 
       (isItem) && this.arrOfItems.unshift();*/
    }
    
    resetArrofItems() {
      /*this.i = 0;
      this.gridData = [];
      this.arrOfItems = [];
      this.itemsRecived = [];
      this.itemsRecivedWitoutFilter = [];*/
    }    

  //#endregion 

  //#region 

    // init years & month

    initArrOfYearsAndMonths() {
      for (let i = 2000; i <= 2100; i++)
        this.arrOfYears.push(i);

      for (let i = 1; i <= 12; i++)
        this.arrOfMonths.push(i);
    }

  //#endregion
}
