import { Component, Input, SimpleChanges, OnChanges, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DatabindingService } from 'src/services/databinding.service';
import { FrmService } from 'src/services/frm/frm.service';
import {Sort} from '@angular/material/sort';
import * as lang from './../../../../settings/lang';
import * as $ from 'jquery';

@Component({
  selector: 'app-search-for-approve',
  templateUrl: './search-for-approve.component.html',
  styleUrls: ['./search-for-approve.component.css']
})
export class SearchForApproveComponent implements OnInit, OnChanges {
  // startup var
  @Input('objID') objID
  lang: any;
  branches: any = [];
  selectedBranch = localStorage.getItem('branchCode');
  date: any = "";
  sqlDate: any = "";

  // search var
  isDbLoading: boolean = true;
  isVisible: boolean = true;
  isDisabled: boolean = true;
  isSearching: boolean = false;

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
  ApprovedDate: string="";
  TableName: string;
  KeyName: string;
  EventID: number;
  CmdApproveTag: string;

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
    this.dataToBeApproved(this.objID, localStorage.getItem("branchCode"), this.date);
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

  dataToBeApproved(objID, branchCode, date) {
    this.isSearching = true;

    this.adjustRequiredData(objID);

/* TAREK 27/12/2021
    this.service.getDataToBeApproved(objID, branchCode, date).subscribe(
      res => {
        let data: any = res;
        this.data = JSON.parse(data);
        this.date = this.getHTMLDate(this.data[this.data.length - 1].maxdate.split(" "));
        this.data.pop();
        this.isNewData = false;
        this.isSearching = false;
      }
    )
*/
  this.service.getDataToBeApproved(objID, branchCode, date).subscribe(
    res => {
      let data: any = res;
      this.data = data.data;
//      this.date = this.getHTMLDate(data.maxdate.replace(/['"]+/g, '').split(" "));
      this.isNewData = false;
      this.isSearching = false;
    }
  )

}

  adjustRequiredData(objID) {
    switch (objID) {
      case "286" : // PAS verify
        this.btnText = "Verify Selected Payment.";
        this.DblClickID = 283;
        this.DblClickCol = 0;
        this.ApproveValue = 1;
        this.ApprovedBy = "VerifiedBy";
        this.ApprovedDate = "VerifiedDate";
        this.TableName = "PmtApproveHdr";
        this.KeyName = "PASNum";
        this.EventID = 21;
        this.CmdApproveTag = "Verified";
        this.isVisible = true;
        break;


      case "284": // PAS
          this.btnText = "Approve Selected Payment."
          this.DblClickID = 283
          this.DblClickCol = 0
          this.ApproveValue = 1
          this.ApprovedBy = "ApprovedBy"
          this.ApprovedDate = "ApprovedDate"
          this.TableName = "PmtApproveHdr"
          this.KeyName = "PASNum"
          this.EventID = 20
          this.CmdApproveTag = "Approved"
          this.isVisible = true;
          break;
  
      case "290": // IRQ
        this.btnText = "Approve Selected Request."
        this.DblClickID = 283
        this.DblClickCol = 6
        this.ApproveValue = 1
        this.ApprovedBy = "ApprovedBy"
        this.ApprovedDate = "ApprovedDate"
        this.TableName = "ItemRequestHdr"
        this.KeyName = "RequestNum"
        this.EventID = 4
        this.CmdApproveTag = "Approved"
        this.isVisible = true;
        break;

      case "277": // POQ
        this.btnText = "Approve Selected Quotation."
        this.DblClickID = 274
        this.DblClickCol = 1
        this.ApproveValue = 1
        this.ApprovedBy = "ApprovedBy"
        this.TableName = "PurQuotationsHdr"
        this.KeyName = "QuotNum"
        this.EventID = 17
        this.CmdApproveTag = "Approved"
        this.isVisible = true;
        break;

        case "275": // PORQ
        this.btnText = "Approve Selected Request."
        this.DblClickID = 274
        this.DblClickCol = 1
        this.ApproveValue = 1
        this.ApprovedBy = "ApprovedBy"
        this.TableName = "PORequestHdr"
        this.KeyName = "RequestNum"
        this.EventID = 18
        this.CmdApproveTag = "Approved"
        this.isVisible = true;
        break;

        case "263" : // XREQ
        this.btnText = "Approve Selected Request.";
        this.DblClickID = 261;
        this.DblClickCol = 1;
        this.ApproveValue = 1;
        this.ApprovedBy = "ApprovedBy";
        this.TableName = "ExpensesRequestsHdr";
        this.KeyName = "RequestNum";
        this.EventID = 19;
        this.CmdApproveTag = "Approved";
        this.isVisible = true;
        break;

        case "276":
          this.btnText = "Approve Selected Order."
          this.DblClickID = 31
          this.DblClickCol = 0
          this.ApproveValue = 1
          this.ApprovedBy = "ApprovedBy"
          this.TableName = "PurchaseOrderHdr"
          this.KeyName = "OrderNum"
          this.EventID = 16
          this.CmdApproveTag = "Approved"
          this.isVisible = true;
          break;

        case "246" : // SQuot
          this.btnText = "Approve Selected Quot.";
          this.DblClickID = 232;
          this.DblClickCol = 0;
          this.ApproveValue = 2;
          this.ApprovedBy = "ApprovedBy";
          this.TableName = "SalQuotationsHdr";
          this.KeyName = "QuotNum";
          this.EventID = 5;
          this.CmdApproveTag = "Approved";
          this.isVisible = true;
          break;          
                 
        case "245" : // SORD
          this.btnText = "Approve Selected Order";
          this.DblClickID = 21;
          this.DblClickCol = 0;
          this.ApproveValue = 2;
          this.ApprovedBy = "ApprovedBy";
          this.ApprovedDate = "ApprovedDate";
          this.TableName = "SalesOrderHdr";
          this.KeyName = "OrderNum";
          this.EventID = 15;
          this.CmdApproveTag = "Approved";
          this.isVisible = true;
          break; 
          
        case "341" : // Approve New Customer
          this.btnText = "Approve Selected New Customer.";
          this.DblClickID = 339;
          this.DblClickCol = 0;
          this.ApproveValue = 1;
          this.ApprovedBy = "ApprovedBy";
          this.TableName = "PersonsRequests";
          this.KeyName = "RequestNum";
          this.EventID = 22;
          this.CmdApproveTag = "Approved";
          this.isVisible = true;
          break;  
          
        case "342" : // Approve Customer Update
          this.btnText = "Approve Customer Update.";
          this.DblClickID = 340;
          this.DblClickCol = 0;
          this.ApproveValue = 1;
          this.ApprovedBy = "ApprovedBy";
          this.TableName = "PersonsRequests";
          this.KeyName = "RequestNum";
          this.EventID = 23;
          this.CmdApproveTag = "Approved";
          this.isVisible = true;
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

    return `${d[2]}-${d[1]}-${d[0]}`
  }

  // get SQL date
  formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1), 
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

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

    /*if (!sort.active || sort.direction === '') {
      this.data = this.original;
      return;
    }*/

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
    this.dataToBeApproved(this.objID, localStorage.getItem("branchCode"), (this.date == null) ? "" : this.formatDate(this.date));
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

  approveData() {
    if (localStorage.getItem('branchCode') != this.selectedBranch) {
      this.notification.warning(`${this.lang.approveWarningMsgTitle}`, `${this.lang.approveWarningMsgDetails}`);
      return;
    }

    this.modal.confirm({
      nzTitle: this.lang.approveConfirmTitle,
      nzContent: this.lang.approveConfirmMsg,
      nzCancelText: this.lang.cancel,
      nzOkText: this.lang.delete,
      nzOkType: 'primary',
      nzOnOk: () => {
        this.callBackEndToApprove();
      },        
      nzClassName: (this.getLang() == 'AR') ? 'lang-ar' : 'lang-en'
    })
  }

  callBackEndToApprove() {
    let date;

    this.service.getCurrentDate("MM/dd/yyyy").subscribe(
      res => {
        date = res;
        let SQL = "UPDATE " + this.TableName + " SET " + this.CmdApproveTag + "=" + this.ApproveValue + (this.ApprovedBy != "" ? ", " + this.ApprovedBy + "='" + localStorage.getItem('username') + "'" : "") + (this.ApprovedDate != "" ? ", " + this.ApprovedDate + "='" + date + "'" : "") + " WHERE " + this.KeyName + "='" + this.selectedItemIndedx[this.KeyName] + "'";
        this.service.getCurrentDate("dd/MM/yyyy hh:mm:ss.s").subscribe(            
          res => {
            this.sqlDate = res;

            if (this.objID == 342) {          
              let DateModified = res;              
//TAREK       SQL += " " + "UPDATE Persons SET Notes='" + this.selectedItemIndedx["Update Reason"]  + "', PersonName='" + this.selectedItemIndedx["PersonName"] + "',PersonAltrName='" + this.selectedItemIndedx["Arabic Name"] + "',CategoryCode=" + this.selectedItemIndedx["CategoryCode"] + ",PersonGroupID='" + this.selectedItemIndedx["PersonGroupID"] + "', PersonSubGroupID='" + this.selectedItemIndedx["PersonSubGroupID"] + "',CenterCode=" + this.selectedItemIndedx["CenterCode"] + ", CreditLimit =" + this.selectedItemIndedx["CreditLimit"] + ", PmtTerms='" + this.selectedItemIndedx["PmtTerms"] + "',Address='" + this.selectedItemIndedx["Address"] + "',PoBox='" + this.selectedItemIndedx["PoBox"] + "',Fax='" + this.selectedItemIndedx["Fax"]  + "',Phone='" + this.selectedItemIndedx["Phone"]  + "',AltrPhone='" + this.selectedItemIndedx["AltrPhone"]  + "',Contact='" + this.selectedItemIndedx["Contact"]  + "',ContactTitle='" + this.selectedItemIndedx["ContactTitle"]  + "',E_Mail='" + this.selectedItemIndedx["E_Mail"]  + "',IssuedBy='" + localStorage.getItem('username')  + "',TradeLicenseNo = '" + this.selectedItemIndedx["TradeLicenseNo"]  + "' ,DateModified='" + DateModified + "'  WHERE(PersonCode='" + this.selectedItemIndedx["PersonCode"]  + "')" //Approve Customer Update  
              SQL += " " + "UPDATE Persons SET Notes='" + this.selectedItemIndedx["Update Reason"]  + "', PersonName='" + this.selectedItemIndedx["PersonName"] + "',PersonAltrName='" + this.selectedItemIndedx["Arabic Name"] + "',CategoryCode=" + this.selectedItemIndedx["CategoryCode"] + ",PersonGroupID='" + this.selectedItemIndedx["PersonGroupID"] + "', PersonSubGroupID='" + this.selectedItemIndedx["PersonSubGroupID"] + "',CenterCode=" + this.selectedItemIndedx["CenterCode"] + ", CreditLimit =" + this.selectedItemIndedx["CreditLimit"] + ", PmtTerms='" + this.selectedItemIndedx["PmtTerms"] + "',Address='" + this.selectedItemIndedx["Address"] + "',PoBox='" + this.selectedItemIndedx["PoBox"] + "',Fax='" + this.selectedItemIndedx["Fax"]  + "',Phone='" + this.selectedItemIndedx["Phone"]  + "',AltrPhone='" + this.selectedItemIndedx["AltrPhone"]  + "',Contact='" + this.selectedItemIndedx["Contact"]  + "',ContactTitle='" + this.selectedItemIndedx["ContactTitle"]  + "',E_Mail='" + this.selectedItemIndedx["E_Mail"]  + "',IssuedBy='" + localStorage.getItem('username')  + "',TradeLicenseNo = '" + this.selectedItemIndedx["TradeLicenseNo"]  + "' ,DateModified='" + date + "'  WHERE(PersonCode='" + this.selectedItemIndedx["PersonCode"]  + "')" //Approve Customer Update  
  
              this.approveOnBackEnd(SQL);
            } else {
              this.approveOnBackEnd(SQL);
            } 
          }
        ) 
      }
    ) 

  }

  approveOnBackEnd(sql) {
    let original = this.data;
    this.data = this.data.filter(d => d[this.KeyName] != this.selectedItemIndedx[this.KeyName]);
    this.isNewData = true;  
    let options = (localStorage.getItem('lang') == 'EN') ? {nzClass: 'lang-en'} : {nzClass: 'lang-ar'};

    this.service.execQuery(sql).subscribe(
      res => {

        this.service.Notify(this.EventID, this.renderHTMLTable(this.selectedItemIndedx)).subscribe(
          res => {
            this.notification.success(`${this.lang.approveTitle}`, `${this.lang.approveSuccess}`, options);
            this.isNewData = false;
            this.isDisabled = true;

            this.tableinfo = '';
            this.tabelToBeSended = '';
          }
        )
      },
      err => {
        this.data = original;
        this.notification.error(`${this.lang.approveTitle}`, `${this.lang.approveFail}`, options);
        this.isNewData = false;
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
        this.dataToBeApproved(this.objID, localStorage.getItem('branchCode'), this.date);
        clearInterval(isObjID);
      }
    }, 100);
  }   

}
