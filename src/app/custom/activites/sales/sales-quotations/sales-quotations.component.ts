import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sales-quotations',
  templateUrl: './sales-quotations.component.html',
  styleUrls: ['./sales-quotations.component.css']
})
export class SalesQuotationsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  //#region 

    // check lang

    getLang() {
      return localStorage.getItem('lang');
    }  

  //#endregion   

}
