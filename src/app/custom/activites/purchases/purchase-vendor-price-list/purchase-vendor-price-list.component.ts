import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-purchase-vendor-price-list',
  templateUrl: './purchase-vendor-price-list.component.html',
  styleUrls: ['./purchase-vendor-price-list.component.css']
})
export class PurchaseVendorPriceListComponent implements OnInit {

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
