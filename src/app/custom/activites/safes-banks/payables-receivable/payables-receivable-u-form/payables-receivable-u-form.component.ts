import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'payables-receivable-u-form',
  templateUrl: './payables-receivable-u-form.component.html',
  styleUrls: ['./payables-receivable-u-form.component.css']
})
export class PayablesReceivableUFormComponent implements OnInit {

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
