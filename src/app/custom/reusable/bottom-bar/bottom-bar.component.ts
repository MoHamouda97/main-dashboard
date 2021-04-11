import { Component, OnInit } from '@angular/core';
import { DatabindingService } from 'src/services/databinding.service';
import * as lang from './../../../../settings/lang';

@Component({
  selector: 'app-bottom-bar',
  templateUrl: './bottom-bar.component.html',
  styleUrls: ['./bottom-bar.component.css']
})
export class BottomBarComponent implements OnInit {
  lang: any;

  constructor(private binding: DatabindingService) { }

  ngOnInit() {
    //#region 

      // dealing with page direction
      // Mohammed Hamouda - 29/12/2020 => v1 (detect language changing)

      this.binding.checkIsLangChanged.subscribe(
        res => {
          if (res != null)
            this.lang = (res == 'EN') ? lang.en : lang.ar;
        }
      );

      this.lang = (localStorage.getItem('lang') == 'EN') ? lang.en : lang.ar;

    //#endregion     
  }
 
  //#region 

    // check lang

    getLang() {
      return localStorage.getItem('lang');
    }

  //#endregion 
   
}
