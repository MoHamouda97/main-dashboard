import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'quotations-u-form',
  templateUrl: './quotations-u-form.component.html',
  styleUrls: ['./quotations-u-form.component.css']
})
export class QuotationsUFormComponent implements OnInit {

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
