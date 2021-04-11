import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabindingService } from 'src/services/databinding.service';
import * as lang from './../../../../../../settings/lang';

@Component({
  selector: 'bills-grid',
  templateUrl: './bills-grid.component.html',
  styleUrls: ['./bills-grid.component.css']
})
export class BillsGridComponent implements OnInit, OnChanges {
  // grid form
  gridForm: FormGroup;

  // can use grid or not
  @Input('isActiveGrid') isActiveGrid = false;
  @Input('data') data = [];
  @Input('gridDataFromParent') gridDataFromParent = false;

  // send data to parent
  @Output('returnGrid') returnGrid : EventEmitter<any> = new EventEmitter();  

  // for track validatable values  
  @ViewChild('account', {static: false}) account: ElementRef;   

  // display
  isShowGrid: boolean = true;  
  isAdd: boolean = true;
  gridData: any = [];

  // grid vars
  i: number = 0;
  arrOfItems: any = [];
  itemsRecived: any = [];
  itemsRecivedWitoutFilter: any = [];
  indexOfItemToBeUpdated: any;

  // popup data
  popupData: any = [];
  tblData: any = [];
  original: any = [];
  pouppTitle: string = 'Accounts';
  pmtData: any = [];
  
  // for modal
  isVisible: boolean = false;

  // lang
  lang: any = [];  

  constructor(private fb: FormBuilder, private binding: DatabindingService) { }

  ngOnInit() {
    this.gridFormGenerator();

    // check item to be updated
    this.binding.checkItemUpdate.subscribe(
      res => {
        if (res != null) {                
          this.addValuesToForm(this.arrOfItems[res]);                                         
          this.indexOfItemToBeUpdated = res;
          this.isAdd = false;
          this.isShowGrid = false;
        }
      }
    );
    
    // check removing item from grid
    this.binding.checkItemRemoved.subscribe(
      res => {
        if (res != null) {
          this.arrOfItems = this.arrOfItems.filter(i => i.id !== res);

          this.isAdd = true;
          this.isShowGrid = true;
          
          this.filtredGrid();
          this.resetGridForm();        
        }
      }
    ); 
    
    // responding to language change
    this.binding.checkIsLangChanged.subscribe(
      res => {
        if (res != null) {
          this.lang = (res == 'EN') ? lang.en : lang.ar;
        }              
      }
    );

    this.lang = (localStorage.getItem('lang') == 'EN') ? lang.en : lang.ar;     
    
  }

  //#region 

    // check lang

    getLang() {
      return localStorage.getItem('lang');
    }  

  //#endregion   

  //#region 

    // generate grid form

    gridFormGenerator() {
      this.gridForm = this.fb.group({
        AccID: ['', [Validators.required]],
        AccName: [''],
        CostCenters: ['0'],
        ID: [''],
        Memo: [''],
        PersonCode: [''],
        PersonName: [''],
        Value: ['', [Validators.required]]
      });
    }

    resetGridForm() {
      this.gridForm.reset({
        AccID: '',
        AccName: {value: '', disabled: true},
        CostCenters: '0',
        ID: '',
        Memo: '',
        PersonCode: '',
        PersonName: '',
        Value: '',
      })      
    }

  //#endregion

  //#region // deal with grid
  
    loopThroughGrid(gridData) {
      const items = gridData;
      for (let i = 0; i <= items.length - 1; i++) {

        this.addValuesToForm(items[i])         
        this.addToGrid(items[i], 'recive'); 
        
        this.itemsRecivedWitoutFilter.push(items[i]);
      }      
    }

    addValuesToForm(item) {
      this.gridForm.get('AccID').setValue(item['AccID']);
      this.gridForm.get('AccName').setValue(item['AccName']);
      this.gridForm.get('CostCenters').setValue(item['CostCenters']);
      this.gridForm.get('ID').setValue(item['ID']);
      this.gridForm.get('Memo').setValue(item['Memo']);
      this.gridForm.get('PersonCode').setValue(item['PersonCode']);
      this.gridForm.get('PersonName').setValue(item['PersonName']);
      this.gridForm.get('Value').setValue(item['Value']);
    }    

    hideGrid() {
      this.isShowGrid = false;
      this.isAdd = true;
    }

    showGrid() {
      this.isShowGrid = true;
      this.resetGridForm();
    }

    editGrid() {
      const {ID, ...rest} = this.gridForm.getRawValue();
      const id = this.arrOfItems[this.indexOfItemToBeUpdated].id;

      this.arrOfItems[this.indexOfItemToBeUpdated] = this.gridForm.getRawValue();
      this.arrOfItems[this.indexOfItemToBeUpdated].id = id;
      rest.id = id;

      const updatedItem: any[] = [this.indexOfItemToBeUpdated, rest]; 

      this.binding.sendUpdatedItem(updatedItem);
      this.resetGridForm();
      this.filtredGrid();

      this.isShowGrid = true;
    }

    addToGrid(item: any = {}, type = "new") {
      // add item to arr of item
      this.addItemToArr(item);

      // add item to grid
      this.addRow(item);          

      // reset form
      this.resetGridForm();       
    }

    addRow(item: any = {}) {
      const {ID, ...rest} = this.gridForm.getRawValue();
      
      this.gridData = rest;

      this.filtredGrid();
    } 

    addItemToArr(item: any = {}) {
      this.i++;    
      const isItem = (Object.keys(item).length > 0) ? true : false;
  
      const addProp = (!isItem) ? this.gridForm.getRawValue() : item;
      addProp.id = this.i;
  
      this.arrOfItems = [
        ...this.arrOfItems,
        addProp      
      ];
  
       // remove first object from array 
       (isItem) && this.arrOfItems.unshift();
    }    
    
    resetArrofItems() {
      this.i = 0;
      this.gridData = [];
      this.arrOfItems = [];
    } 
    
    filtredGrid() {
      let data: any[] = [];

      this.arrOfItems.forEach(
        val => {
          let {id, ...rest} = val;
          data.push(rest);
        }
      )
    
      this.returnGrid.emit(data);
    }

  //#endregion  

  //#region 

    // deal with modal
    // Mohammed Hamouda - 03/15/2021

    tblPageChangeHandler(data){
      this.tblData = data;
    } 

    onItemClicked(index) {  
      this.gridForm.get('AccID').setValue(this.tblData[index]['AccCode']);
      this.gridForm.get('AccName').setValue(this.tblData[index]['AccName']);      
      this.isVisible = false;
    }
  
    
    filterData(key, val) {  // filter
      (val == '') 
        ? this.data = this.original
        : this.data = this.data.filter(d => d[key].toString().toLocaleLowerCase().trim().includes(val.toLocaleLowerCase().trim()));
    } 
    
    reset() { // reset data
      this.data = this.original;
    }
    
    sotrHandler(event) {
      this.data = event;
    } 
    
    handleCancel(){ // close popup
      this.isVisible = false;      
    }     

  //#endregion

  //#region 

    // check if control has correct value in blur event

    checkIsHaveVal() {
      let value;

      value = this.gridForm.get('AccID').value;
      let accObj = this.data.filter(a => a.AccID == value);

      if (value != "" && accObj.length == 0) {
        this.binding.showMessage("validValue");
        this.account.nativeElement.focus();
        return
      } 
      
      if (accObj.length > 0) {
        this.gridForm.get('AccID').setValue(accObj[0]['AccCode']);
        this.gridForm.get('AccName').setValue(accObj[0]['AccName']);
      } 
      
      if (value == '') {
        this.gridForm.get('AccName').setValue('');
      }    
    }

    isEmpty() {
      let value = this.gridForm.get('AccID').value;
      (value == '') && this.gridForm.get('AccName').setValue('');   
    }

  //#endregion  

  @HostListener('window:keyup', ['$event'])
  onEnter(event) { // add to grid
    (event.keyCode == 13 && this.gridForm.valid && this.isAdd) && this.addToGrid();
    (event.keyCode == 13 && this.gridForm.valid && !this.isAdd) && this.editGrid();
  } 

  ngOnChanges(changes: SimpleChanges) {
    // check can use grid
    const isActiveGrid = setInterval(() => {
      if (typeof (changes.isActiveGrid) == 'undefined') {
        null;
      } else {
        this.isActiveGrid = changes.isActiveGrid.currentValue;
        clearInterval(isActiveGrid);
      }
    }, 100); 

    // check grid data from parent
    const checkGridData = setInterval(() => {
      if (typeof (changes.gridDataFromParent) == 'undefined') {
        null;
      } else {
        let grid = changes.gridDataFromParent.currentValue;

        if (grid.length > 0) {
          this.resetArrofItems();
          this.loopThroughGrid(grid);
          clearInterval(checkGridData);
        }
      }
    }, 100); 
    
    // check acc data
    const accData = setInterval(() => {
      if (typeof (changes.data) == 'undefined') {
        null;
      } else {
        let data = changes.data.currentValue;

        if (data.length > 0) {
          this.data = data;
          this.original = data;
          clearInterval(accData);
        }
      }
    }, 100);    
        
  }    
  
}
