import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-com-ratios',
  templateUrl: './com-ratios.component.html',
  styleUrls: ['./com-ratios.component.css']
})
export class ComRatiosComponent implements OnInit {

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
