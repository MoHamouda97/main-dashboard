import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-purchase-cost-add-ons',
  templateUrl: './purchase-cost-add-ons.component.html',
  styleUrls: ['./purchase-cost-add-ons.component.css']
})
export class PurchaseCostAddOnsComponent implements OnInit {

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
