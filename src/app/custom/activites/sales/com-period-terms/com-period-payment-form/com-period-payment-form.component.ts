import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'com-period-payment-form',
  templateUrl: './com-period-payment-form.component.html',
  styleUrls: ['./com-period-payment-form.component.css']
})
export class ComPeriodPaymentFormComponent implements OnInit {

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
