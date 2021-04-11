import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'vendors-basic-data',
  templateUrl: './vendors-basic-data.component.html',
  styleUrls: ['./vendors-basic-data.component.css']
})
export class VendorsBasicDataComponent implements OnInit {
  isActive: any = '0';
  
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
