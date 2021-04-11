import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'purchase-shipments-broker-form',
  templateUrl: './purchase-shipments-broker-form.component.html',
  styleUrls: ['./purchase-shipments-broker-form.component.css']
})
export class PurchaseShipmentsBrokerFormComponent implements OnInit {

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
