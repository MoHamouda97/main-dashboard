import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-purchase-shipments',
  templateUrl: './purchase-shipments.component.html',
  styleUrls: ['./purchase-shipments.component.css']
})
export class PurchaseShipmentsComponent implements OnInit {

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
