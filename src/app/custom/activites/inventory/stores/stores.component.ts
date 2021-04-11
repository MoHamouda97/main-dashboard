import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css']
})
export class StoresComponent implements OnInit {
  data: any[] = [];
  original: any[] = [];
  tblData: any[] = [];

  constructor() { }

  ngOnInit() {
  }

  //#region 

    // check lang

    getLang() {
      return localStorage.getItem('lang');
    }  

  //#endregion   

  //#region  // sort

  // Mohammed Hamouda - 14/03/2021

  sotrHandler(event) {
    this.data = event;
  }

  //#endregion  

  //#region // tbl functions
  // Mohammed Hamouda 25/01/2021

  filterData(key, val) { // search

    (val == '') 
      ? this.data = this.original
      : this.data = this.data.filter(d => d[key].toLocaleLowerCase().trim().includes(val.toLocaleLowerCase().trim()));
  }

  tblPageChangeHandler(data) { //recive data from table pagination
    this.tblData = data;
  }

  //#endregion

}
