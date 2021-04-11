import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-purchase-vendors',
  templateUrl: './purchase-vendors.component.html',
  styleUrls: ['./purchase-vendors.component.css']
})
export class PurchaseVendorsComponent implements OnInit {

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
