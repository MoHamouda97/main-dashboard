import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'prise-list-u-form',
  templateUrl: './prise-list-u-form.component.html',
  styleUrls: ['./prise-list-u-form.component.css']
})
export class PriseListUFormComponent implements OnInit {
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
