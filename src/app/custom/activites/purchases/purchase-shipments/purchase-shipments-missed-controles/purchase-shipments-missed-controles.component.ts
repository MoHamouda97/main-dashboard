import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'purchase-shipments-missed-controles',
  templateUrl: './purchase-shipments-missed-controles.component.html',
  styleUrls: ['./purchase-shipments-missed-controles.component.css']
})
export class PurchaseShipmentsMissedControlesComponent implements OnInit {

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
