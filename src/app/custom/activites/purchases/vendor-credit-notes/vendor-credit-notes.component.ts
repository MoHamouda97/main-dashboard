import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vendor-credit-notes',
  templateUrl: './vendor-credit-notes.component.html',
  styleUrls: ['./vendor-credit-notes.component.css']
})
export class VendorCreditNotesComponent implements OnInit {  

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
