import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'invoice-u-form',
  templateUrl: './invoice-u-form.component.html',
  styleUrls: ['./invoice-u-form.component.css']
})
export class InvoiceUFormComponent implements OnInit {

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
