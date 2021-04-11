import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vendor-categories',
  templateUrl: './vendor-categories.component.html',
  styleUrls: ['./vendor-categories.component.css']
})
export class VendorCategoriesComponent implements OnInit {

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
