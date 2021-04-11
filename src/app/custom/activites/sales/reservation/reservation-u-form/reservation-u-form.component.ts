import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'reservation-u-form',
  templateUrl: './reservation-u-form.component.html',
  styleUrls: ['./reservation-u-form.component.css']
})
export class ReservationUFormComponent implements OnInit {
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
