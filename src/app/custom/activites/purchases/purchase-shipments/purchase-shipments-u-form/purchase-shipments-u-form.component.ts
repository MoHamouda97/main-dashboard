import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'purchase-shipments-u-form',
  templateUrl: './purchase-shipments-u-form.component.html',
  styleUrls: ['./purchase-shipments-u-form.component.css']
})
export class PurchaseShipmentsUFormComponent implements OnInit {

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
