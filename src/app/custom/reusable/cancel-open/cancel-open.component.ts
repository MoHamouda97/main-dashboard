import { Component, Input, SimpleChanges, OnChanges, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DatabindingService } from 'src/services/databinding.service';
import { FrmService } from 'src/services/frm/frm.service';
import {Sort} from '@angular/material/sort';
import * as lang from './../../../../settings/lang';
import * as $ from 'jquery';

@Component({
  selector: 'app-cancel-open',
  templateUrl: './cancel-open.component.html',
  styleUrls: ['./cancel-open.component.css']
})
export class CancelOpenComponent implements OnInit, OnChanges {
  // startup var
  @Input('objID') objID
  lang: any;
  branches: any = [];
  selectedBranch = localStorage.getItem('branchCode');
  date: any = "";
  sqlDate: any = "";
  closeDate: any = "";

  // search var
  isDbLoading: boolean = true;
  isVisible: boolean = true;
  isDisabled: boolean = true;
  isSearching: boolean = false;
  isCloseDate: boolean = false;

  // table var
  data: any = [];
  isNewData: boolean = true;
  tblData: any;
  selectedItemIndedx: any = [];
  tableinfo: any = '';
  tabelToBeSended: any = '';

  // required data
  btnText: string;
  DblClickID: number;
  DblClickCol: number;
  ApproveValue: number;
  ApprovedBy: string;
  ApprovedDate: string;
  TableName: string;
  KeyName: string;
  EventID: number;
  CmdApproveTag: string; 
  CancelValue: string; 

  constructor(
    private service: FrmService, 
    private binding: DatabindingService,
    private notification: NzNotificationService,
    private modal: NzModalService) { }

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
  
    this.getBranches();
    this.dataToBeCanceled(this.objID, localStorage.getItem("branchCode"), this.date)
  }

  //#region 

    // check lang

    getLang() {
      return localStorage.getItem('lang');
    }

  //#endregion  

  //#region // get branches

  getBranches() {
    this.service.getbranches().subscribe(
      res => {
        this.branches = res;
        this.isDbLoading = false;

      }
    );    
  }

  //#endregion

  //#region // data to be approved

  dataToBeCanceled(objID, branchCode, date) {
    this.isSearching = true;

    this.adjustRequiredData(objID);

    this.service.getDataToBeCanceled(objID, branchCode, date).subscribe(
      res => {
        let data: any = res;
        this.data = data.data;
//        this.date = this.getHTMLDate(data.maxdate.replace(/['"]+/g, '').split(" "));
        this.isNewData = false;
        this.isSearching = false;
        this.closeDate = "";
      }
    )
  }

  adjustRequiredData(objID) {
    switch (objID) {
      case "234" : // Sales Quotations
        this.btnText = "Cancel Selected Quot.";
        this.DblClickID = 232;
        this.DblClickCol = 6;
        this.TableName = "SalQuotationsHdr";
        this.KeyName = "QuotNum";
        this.CmdApproveTag = "Canceled"
        this.CancelValue = "1";
        this.isVisible = true;
        this.isCloseDate = false;
        break; 
        
      case "205" : // Sales OrderHdr
        this.btnText = "Cancel Selected Order";
        this.DblClickID = 21;
        this.DblClickCol = 9;
        this.TableName = "SalesOrderHdr";
        this.KeyName = "OrderNum";
        this.CmdApproveTag = "Canceled";
        this.CancelValue = "1";
        this.isVisible = true;
        this.isCloseDate = false;
        break;  
        
      case "206" : // Sales Invoices
        this.btnText = "Close Selected Invoice";
        this.DblClickID = 20;
        this.DblClickCol = 7;
        this.TableName = "SalesHdr";
        this.KeyName = "SaleNum";
        this.CmdApproveTag = "Closed";
        this.CancelValue = "1";
        this.isVisible = true;
        this.isCloseDate = false;
        break;  
        
      case "213" : // Service Invoice
        this.btnText = "Close Selected Invoice";
        this.DblClickID = 103;
        this.DblClickCol = 7;
        this.TableName = "SalesHdr";
        this.KeyName = "SaleNum";
        this.CmdApproveTag = "Closed";
        this.CancelValue = "1";
        this.isVisible = true;
        this.isCloseDate = false;
        break;
        
      case "207" : // Sales Returns
        this.DblClickID = 26;
        this.DblClickCol = 6;
        this.TableName = "SalesReturnHdr";
        this.KeyName = "RetNum";
        this.CmdApproveTag = "Closed";
        this.CancelValue = "1";
        this.isVisible = false;
        this.isCloseDate = false;
        break; 
        
      case "80" : // Service Order
        this.btnText = "Cancel Selected Order";
        this.DblClickID = 100;
        this.DblClickCol = 6;
        this.TableName = "ServiceOrderHdr";
        this.KeyName = "OrderNum";
        this.CmdApproveTag = "Canceled";
        this.CancelValue = "1";
        this.isVisible = true;
        this.isCloseDate = false;
        break;
        
      case "89" : // Purchase Invoice
        this.btnText = "Close Selected Invoice";
        this.DblClickID = 29;
        this.DblClickCol = 5;
        this.TableName = "PurchaseHdr";
        this.KeyName = "PurNum";
        this.CmdApproveTag = "Closed";
        this.CancelValue = "1";
        this.isVisible = true;
        this.isCloseDate = true;
        break; 
        
      case "208" : // Purchase Order
        this.btnText = "Cancel Selected Order";
        this.DblClickID = 31;
        this.DblClickCol = 8;
        this.TableName = "PurchaseOrderHdr";
        this.KeyName = "OrderNum";
        this.CmdApproveTag = "Canceled";
        this.CancelValue = "1";
        this.isVisible = true;
        this.isCloseDate = false;
        break; 
        
      case "210" : // Purchase Invoice
        this.btnText = "Close Selected Invoice";
        this.DblClickID = 29;
        this.DblClickCol = 12;
        this.TableName = "PurchaseHdr";
        this.KeyName = "PurNum";
        this.CmdApproveTag = "Closed";
        this.CancelValue = "1";
        this.isVisible = true;
        this.isCloseDate = true;
        break;
        
      case "271" : // Expenses Requests
        this.btnText = "Cancel Selected Request";
        this.DblClickID = 261;
        this.DblClickCol = 3;
        this.TableName = "ExpensesRequestsHdr";
        this.KeyName = "RequestNum";
        this.CmdApproveTag = "Canceled";
        this.CancelValue = "1";
        this.isVisible = true;
        this.isCloseDate = false;
        break;
        
        case "293" : // Item Request
        this.btnText = "Cancel Selected Request";
        this.DblClickID = 289;
        this.DblClickCol = 6;
        this.TableName = "ItemRequestHdr";
        this.KeyName = "RequestNum";
        this.CmdApproveTag = "Status";
        this.CancelValue = "2";
        this.isVisible = true;
        this.isCloseDate = false;
        break; 
        
      case "211" : // Purchase Return
        this.btnText = "Cancel Selected Request";
        this.DblClickID = 30;
        this.DblClickCol = 6;
        this.TableName = "PurchaseReturnHdr";
        this.KeyName = "RetNum";
        this.CmdApproveTag = "Canceled";
        this.CancelValue = "1";
        this.isVisible = true;
        this.isCloseDate = false;
        break;
        
      case "360" : // Purchase Quotations
        this.btnText = "Cancel Selected Quot.";
        this.DblClickID = 278;
        this.DblClickCol = 7;
        this.TableName = "PurQuotationsHdr";
        this.KeyName = "QuotNum";
        this.CmdApproveTag = "Status";
        this.CancelValue = "1";
        this.isVisible = true;
        this.isCloseDate = false;
        break;         
    }
  }

  //#endregion

  //#region 

  // get html date 
  getHTMLDate(date) {
    let d = date;

    d = d[0];
    d = d.toString();
    d = d.split('/');

    return `${d[2]}-${d[0]}-${d[1]}`
  }

  // get SQL date
  formatDate(date, isForClose) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1), 
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    if (isForClose)
      return `${year}-${month}-${day}`;

    return `${day}/${month}/${year}`;
  }

  //#endregion  

  // this function is used to recive data from table pagination
  tblPageChangeHandler(data){
    this.tblData = data;
  }

  //#region 

  // sort
  // Mohammed Hamouda - 13/01/2021

  sortData(sort: Sort, head) {
    const data = this.data.slice();

    this.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return this.compare(head, head, isAsc);
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  //#endregion  

  //#region // get data

  getData() {
    this.dataToBeCanceled(this.objID, localStorage.getItem("branchCode"), this.formatDate(this.date, false));
  }

  // when user click on a record
  onItemClicked(index) {
    // highlight selected record
    $('body').on("click", '.record', function() {
      $(this).addClass('highlight').siblings().removeClass('highlight')
    });

    this.isDisabled = false; 
    this.selectedItemIndedx = this.tblData[index];
  }
  
  cancelOpen() {
    if (localStorage.getItem('branchCode') != this.selectedBranch) {
      this.notification.warning(`${this.lang.cancelWarningMsgTitle}`, `${this.lang.approveWarningMsgDetails}`);
      return;
    }

    if (this.isCloseDate && this.closeDate == "") {
      this.notification.warning(`${this.lang.closeDateWarningTitle}`, `${this.lang.closeDateWarningMsg}`);
      return;
    }

    this.modal.confirm({
      nzTitle: this.lang.approveConfirmTitle,
      nzContent: this.lang.cancelWarningMsgDetails,
      nzCancelText: this.lang.cancel,
      nzOkText: this.lang.delete,
      nzOkType: 'primary',
      nzOnOk: () => {
        this.callBackEndToCancel();
      },        
      nzClassName: (this.getLang() == 'AR') ? 'lang-ar' : 'lang-en'
    })
  }

  callBackEndToCancel() {
    let date;

    let closeDate = (this.closeDate != '') 
      ? `${this.formatDate(this.closeDate, true)} ${this.closeDate.toLocaleTimeString('en-US', { hour12: false })}`
      : '';

    this.service.getCurrentDate("MM/dd/yyyy").subscribe(
      res => {
        date = res;
        var key = Object.keys(this.selectedItemIndedx)[this.DblClickCol];
        let SQL = "UPDATE " + this.TableName + " SET " +this.CmdApproveTag+ "= "+ "'" + this.CancelValue + "'" +(this.isCloseDate ? (", CloseDate = \'" + closeDate + "\'") : "") + " WHERE " + this.KeyName + "=\'" + this.selectedItemIndedx[key] + "\'";

        this.service.getCurrentDate("dd/MM/yyyy hh:mm:ss.s").subscribe(            
          res => {
            this.sqlDate = res;

            this.cancelOnBackEnd(SQL);

            this.closeDate = "";
          }
        ) 
      }
    )
  }

  cancelOnBackEnd(sql) {
    let original = this.data;
    this.data = this.data.filter(d => d[this.KeyName] != this.selectedItemIndedx[this.KeyName]);
    this.isNewData = true;  
    let options = (localStorage.getItem('lang') == 'EN') ? {nzClass: 'lang-en'} : {nzClass: 'lang-ar'};

    this.service.execQuery(sql).subscribe(
      res => {

        this.notification.success(`${this.lang.approveTitle}`, `${this.lang.approveSuccess}`, options);
        this.isNewData = false;
        this.isDisabled = true;
      },
      err => {
        this.data = original;
        this.notification.error(`${this.lang.approveTitle}`, `${this.lang.approveFail}`, options);
        this.isNewData = false;
        console.log(err)
      }
    )
  }
  
  renderHTMLTable(obj) {
    let objects = Object.keys(obj)
    this.tableinfo += '<BR>';
    this.tableinfo += '<table border=1 style="background-color:rgb(218,244,255);border:1px solid black" bordercolor="black"  cellpadding="2" cellspacing="0"><tr><td>' + this.btnText + '. Has been done</td><td>' + this.selectedItemIndedx[this.KeyName] + '</td></tr><tr><td>Approved by</td><td>' + localStorage.getItem('username') + ' ' + this.sqlDate  + '</td></tr></table><BR>';

    this.tabelToBeSended = '<table border=1 style="background-color:rgb(218,244,255);border:1px solid black" bordercolor="black" cellpadding="5" cellspacing="0">';
    this.tabelToBeSended += '<tr>';

    for (let i = 0; i <= objects.length - 1; i++) {
      this.tabelToBeSended += `<td>${objects[i]}</td>`;

      if (i == objects.length - 1)
        this.tabelToBeSended += '</tr><tr>';
    }

    for (let i = 0; i <= objects.length - 1; i++) {
      this.tabelToBeSended += `<td>${this.selectedItemIndedx[objects[i]]}</td>`;
    }

    this.tabelToBeSended += '</tr> </table> <BR>';

    this.tableinfo += this.tabelToBeSended;

    return this.tableinfo;
  }

  //#endregion

  ngOnChanges(changes: SimpleChanges) {
    // check new objID
    const isObjID = setInterval(() => {
      if (typeof (changes.objID) == 'undefined') {
        null;
      } else {
        this.objID = changes.objID.currentValue;
        this.date = '';
        this.isNewData = true;
        this.dataToBeCanceled(this.objID, localStorage.getItem('branchCode'), this.date);
        clearInterval(isObjID);
      }
    }, 100);
  } 

}
