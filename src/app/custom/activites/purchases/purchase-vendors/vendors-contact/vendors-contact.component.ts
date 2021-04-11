import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'vendors-contact',
  templateUrl: './vendors-contact.component.html',
  styleUrls: ['./vendors-contact.component.css']
})
export class VendorsContactComponent implements OnInit {

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
