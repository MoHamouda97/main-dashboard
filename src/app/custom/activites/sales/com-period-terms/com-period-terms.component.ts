import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-com-period-terms',
  templateUrl: './com-period-terms.component.html',
  styleUrls: ['./com-period-terms.component.css']
})
export class ComPeriodTermsComponent implements OnInit {

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
