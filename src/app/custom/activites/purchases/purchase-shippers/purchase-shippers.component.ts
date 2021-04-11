import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-purchase-shippers',
  templateUrl: './purchase-shippers.component.html',
  styleUrls: ['./purchase-shippers.component.css']
})
export class PurchaseShippersComponent implements OnInit {

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
