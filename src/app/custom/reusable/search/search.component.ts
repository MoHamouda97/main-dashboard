import { Component, OnDestroy, OnInit } from '@angular/core';
import { FrmService } from 'src/services/frm/frm.service';
import { DatabindingService } from 'src/services/databinding.service';
import {operators} from './../../../../settings/operators';
import * as lang from './../../../../settings/lang';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  tableTitle;
  fields;
  lang;
  searchValue;
  operatorValue;
  searchBy;
  SQLstm;
  searchOption = "CenterCode";
  searchOperator = "=";

  openOperator = false;
  openValue = false
  openBtn = false;

  operators = operators;
  isDbLoading = true;  
  isSearching = false;

  private unsubscribe$: Subject<any> = new Subject<any>();

  constructor(private service: FrmService, private binding: DatabindingService) { }

  ngOnInit() {
    this.tableTitle = localStorage.getItem('frmName').slice(3)
    switch (localStorage.getItem('frmName')) {
      case 'FrmCostCenters':
        this.tableTitle = 'CostCenters'
        break;
      case  'FrmEntryType':
        this.tableTitle = 'AccTransTypes';
        break;
    }


    this.loadTableFieldsName(`SELECT * FROM ${this.tableTitle}`);

    // extract SQL statement
    this.SQLstm = localStorage.getItem("sqlStm");   

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
    
    //#region 

        // get all data
        // Mohammed Hamouda - 29/12/2020

        this.binding.checkAllData.pipe(
          takeUntil(this.unsubscribe$)
        ).subscribe(
          res => {
            if (res != null && res != false) {
              this.getData(res);

              this.openOperator = false;
              this.openValue = false
              this.openBtn = false;
            }              
          }
        );

    //#endregion     
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.binding.sendingSearchData(null);
  }

  //#region 
    // load table fields name
    // Mohammed Hamouda - 30/12/2020  

    loadTableFieldsName(SQLStm) {
    this.service.loadTableFieldsName(SQLStm).subscribe(
      res => {
        this.fields = res;
        this.isDbLoading = false;
      },
      err => {
        console.log(err)
      }
    )
  }

  //#endregion

  //#region 

    // handle search functionality 
    // Mohammed Hamouda - 31/12/2020 => v2 (just update getData() to do async work with task bar)

    getData(isFromTaskBar) {
      this.isSearching = true;

      let cri;

      (isFromTaskBar == false) 
        ? cri = `${this.tableTitle}.${this.searchOption} ${this.searchOperator} '${this.searchValue}'`.replace('%', '**')
        : cri = '';

      this.service.loadData(this.SQLstm, cri).subscribe(
        res => {
          this.isSearching = false;
          this.binding.sendingSearchData(res);          
        },
        err => {
        }
      )
    }

    searchByClick() {
      this.getData(false);
    }

    searchByEnter() {
      this.getData(false);
    }

  //#endregion

  //#region 

    // check lang

    getLang() {
      return localStorage.getItem('lang');
    }

  //#endregion

}
