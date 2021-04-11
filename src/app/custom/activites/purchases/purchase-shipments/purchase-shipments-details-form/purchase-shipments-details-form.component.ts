import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'purchase-shipments-details-form',
  templateUrl: './purchase-shipments-details-form.component.html',
  styleUrls: ['./purchase-shipments-details-form.component.css']
})
export class PurchaseShipmentsDetailsFormComponent implements OnInit {

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
