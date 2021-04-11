import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'com-ratios-u-form',
  templateUrl: './com-ratios-u-form.component.html',
  styleUrls: ['./com-ratios-u-form.component.css']
})
export class ComRatiosUFormComponent implements OnInit {
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
