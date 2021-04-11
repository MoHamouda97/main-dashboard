import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payables-receivable',
  templateUrl: './payables-receivable.component.html',
  styleUrls: ['./payables-receivable.component.css']
})
export class PayablesReceivableComponent implements OnInit {

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
