import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'com-period-u-form',
  templateUrl: './com-period-u-form.component.html',
  styleUrls: ['./com-period-u-form.component.css']
})
export class ComPeriodUFormComponent implements OnInit {
  isShowForm: boolean = true;
  
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
