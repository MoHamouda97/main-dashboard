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
  @Input('gridType') gridType;

  // grid data
  data: any[] = [];

  // sales grid
  @Input('custCode') custCode;
  salesData: any[] = [];
  quotNumQuery: string = '';
  isQuotNum: boolean = false;

  constructor(private binding: DatabindingService, private service: FrmService) { }

  ngOnInit() {
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
      switch (this.gridType) {
        case 'sales' :
          this.data = [
            ...this.data,
            {id: this.i, QuotNum: "", ItemCode: "", ItemName: "", OrderedQty: "", Price: "", SubTotal: "", CanceledQty: "", Qty: "", Issued: "", Invoiced: "", Quot_ID: "", ID: "", ListPrice: "", Percentage: ""}
          ]
          break;
      }
      this.i++;
    }

    removeRow(index) { // remove row from grid
      this.data = this.data.filter(d => d.id !== index);
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

      this.binding.showMessage('noCustomer')

    }

  //#endregion

  ngOnChanges(changes: SimpleChanges) {
    // check grid type
    const whatType = setInterval(() => {
      if (typeof (changes.gridType) == 'undefined') {
        null;
      } else {
        this.i = 0;
        this.data = [];

        this.gridType = changes.gridType.currentValue;
        this.addRow();
        clearInterval(whatType);
      }
    }, 100); 
    
    // check customer code custCode
    const custCode = setInterval(() => {
      if (typeof (changes.custCode) == 'undefined') {
        null;
      } else {
        this.custCode = changes.custCode.currentValue;
        this.quotNumQuery = `SELECT  QuotNum, QuotDate, ExpDate, Canceled, Approved FROM SalQuotationsHdr WHERE (CustCode='${this.custCode}') AND Canceled = 0 ORDER BY QuotNum`
        clearInterval(custCode);
      }
    }, 100);     
  }

}
