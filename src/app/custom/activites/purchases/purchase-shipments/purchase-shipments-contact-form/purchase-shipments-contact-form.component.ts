import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'purchase-shipments-contact-form',
  templateUrl: './purchase-shipments-contact-form.component.html',
  styleUrls: ['./purchase-shipments-contact-form.component.css']
})
export class PurchaseShipmentsContactFormComponent implements OnInit {

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
