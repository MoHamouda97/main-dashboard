import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DatabindingService } from 'src/services/databinding.service';
import { FrmService } from 'src/services/frm/frm.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit, OnChanges {
  i = 0;
  // grid type
  @Input('gridData') gridDataGrid;
  @Input('isDisabled') isDisabled = false;

  // grid data
  data: any[] = [];

  // sales grid
  @Input('custCode') custCode;
  salesData: any[] = [];
  quotNumQuery: string = '';
  isQuotNum: boolean = false;

  // tax
  isTax: boolean = false;
  taxObj: any[] = [];
  taxArr: any[] = [];

  // get currency & is auto calc vat
  system = JSON.parse(localStorage.getItem('systemVariables'));
  currency = this.system[0]["LocalCurrencyName"];
  isAutoTax = this.system[0]["AutoCalcVAT"];

  constructor(private binding: DatabindingService, private service: FrmService) { }

  ngOnInit() {
    this.binding.updatedItemValue.subscribe(
      res => {
        if (res != null) {
          const index = res[0];
          const item = res[1];

        (item["ItemCode"].slice(0, 8) != this.system[0].Glb_VAT_ItemCode.slice(0, 8))
          ? item.isTax = false
          : item.isTax = true;          

          this.data[index] = item;
        }
      }
    )

    this.binding.autoTax.subscribe(
      res => {
        if (res != null) {
          this.taxArr = [];
          this.taxArr.push(res);
          (this.taxArr.length == 0) ? this.isTax = false : this.isTax = true;
        }
      }
    )
  }

  //#region 

    // check lang

    getLang() {
      return localStorage.getItem('lang');
    }  

  //#endregion 
  
  //#region     
    // Mohammed Hamouda - 18/02/2021

    addRow() { // add grid row according to grid type
      this.data = [
        ...this.data,
        this.gridDataGrid
      ]
    }

    updateRow(index) { // item to be updated
      this.binding.itemUpdate(index);
    }

    removeRow(index) { // remove row from grid
      this.data = this.data.filter(d => d.id !== index)    
      this.binding.itemRemoved(index);
    } 

    setValue(index, key, val) { // set value when user start typing => 21/02/2021
      this.data[index][key] = val;
    } 
    
  //#endregion
  
  //#region 

    // sales grid functions
    // Mohammed Hamouda - 21/02/2021

    getQuots() {
      if (typeof(this.custCode) != 'undefined') {
        this.isQuotNum = true;
        let criteria = `QuotNum = '${this.custCode}'`
        console.log(this.quotNumQuery);
        this.service.LoadPopUpCheck(this.quotNumQuery, criteria).toPromise()
          .then((res) => {
            this.isQuotNum = false;
            console.log(res);
          }).catch()
        return;
      }

      this.binding.showMessage('noCustomer');

    }

  //#endregion

  ngOnChanges(changes: SimpleChanges) {
    // check grid data
    const gridData = setInterval(() => {
      if (typeof (changes.gridDataGrid) == 'undefined') {
        null;
      } else {
        if (!changes.gridDataGrid.isFirstChange()) {
          let newVal: any = changes.gridDataGrid.currentValue;

          if (Array.isArray(newVal)) {
            if (newVal.length > 0) {
              for (let i = 0; i <= newVal.length - 1; i++) {
                this.i++

                this.gridDataGrid = newVal[i];
                this.gridDataGrid.id = this.i;

                (newVal[i]["ItemCode"].slice(0, 8) != this.system[0].Glb_VAT_ItemCode.slice(0, 8))
                  ? this.gridDataGrid.isTax = false
                  : this.gridDataGrid.isTax = true;

                (newVal[i]["ItemCode"].slice(0, 8) == this.system[0].Glb_VAT_ItemCode.slice(0, 8))                   
                  ? this.isTax = true
                  : null;

                this.addRow();
              }
            } else {
              this.i = 0;
              this.data = [];
              this.taxArr = [];
              this.isTax = false;
            }
          } else {
            this.i++;
            this.gridDataGrid = changes.gridDataGrid.currentValue;         
            this.gridDataGrid.id = this.i;

            (changes.gridDataGrid.currentValue["ItemCode"].slice(0, 8) != this.system[0].Glb_VAT_ItemCode.slice(0, 8))
              ? this.gridDataGrid.isTax = false
              : this.gridDataGrid.isTax = true;

            (changes.gridDataGrid.currentValue["ItemCode"].slice(0, 8) == this.system[0].Glb_VAT_ItemCode.slice(0, 8))                   
              ? this.isTax = true
              : null;              

            this.addRow();         
          }

        }
        clearInterval(gridData);
      }
    }, 100); 
    
    // check customer code custCode
    const isDisabled = setInterval(() => {
      if (typeof (changes.isDisabled) == 'undefined') {
        null;
      } else {
        this.isDisabled = changes.isDisabled.currentValue;
        clearInterval(isDisabled);
      }
    }, 100);     
  }

}
