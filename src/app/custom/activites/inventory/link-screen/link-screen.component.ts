import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-link-screen',
  templateUrl: './link-screen.component.html',
  styleUrls: ['./link-screen.component.css']
})
export class LinkScreenComponent implements OnInit {

  // link text from
  linkFrom: string = 'Service Order';
  linkTo: string = 'Issue Vouchers';

  // data
  data: any[] = [];

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
