import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import * as headers from './../../settings/headers';

@Injectable({
  providedIn: 'root'
})
export class FrmService {

  constructor(private http: HttpClient) { }

  getTableFields(SourceTable) {
    return this.http.get(`${environment.endPoint}Generic/GetHTTPKeys?SourceTable=${SourceTable}`, {headers: headers.noAuthHeader})
  }

  GetTypes(table) {
    return this.http.get(`${environment.endPoint}Generic/GetTypes?table=${table}`, {headers: headers.noAuthHeader})
  }

  //#region 
    // load table fields name
    // Mohammed Hamouda - 30/12/2020

    loadTableFieldsName(SQLStm) {
      return this.http.get(`${environment.endPoint}Generic/LoadKeys?SQLStatment=${SQLStm}`, {headers: headers.noAuthHeader})
    }

  //#endregion

  //#region 
    // load table fields name
    // Mohammed Hamouda - 30/12/2020

    loadData(SQLStm, criteria) {
      return this.http.get(`${environment.endPoint}Generic/LoadFrm?SQLStatment=${SQLStm}&Criteria=${criteria}`, {headers: headers.noAuthHeader})
    }

  //#endregion

  //#region 

    // delete record
    // Mohammed Hamouda - 3/1/2021

    DeleteRecord(SourceTable, masters, childs, gridIndex, gridrowlnum, gridcolnum, gridTableName, FormFieldsArray) {
      return this.http.post(`${environment.endPoint}Generic/DeleteRecord?SourceTable=${SourceTable}&masters=${masters}&childs=${childs}&gridIndex=${gridIndex}&gridrowlnum=${gridrowlnum}&gridcolnum=${gridcolnum}&gridTableName=${gridTableName}`, FormFieldsArray, {headers: headers.utfHeader})
    }
    
  //#endregion

  //#region 

    // get dictionary
    // Mohammed Hamouda - 3/1/2021  
  
  GetDichttp() {
    return this.http.get(`${environment.endPoint}Generic/GetDichttp`, {headers: headers.noAuthHeader})
  }

  //#endregion

  //#region 

    // user authorization
    // Mohammed Hamouda - 4/1/2021  
  
    getSecurity(ObjID, Glb_User_Name, Glb_Branch_Code, SqlStatement, SourceTable, SysSalesMan, SysPASman, SysBillsMan, SysJournalsMan, SysPayablesMan, Language) {
      return this.http.get(`${environment.endPoint}Generic/SetSecurity?SQLStatment=${SqlStatement}&Glb_User_Name=${Glb_User_Name}&Glb_Branch_Code=${Glb_Branch_Code}&SqlStatement=${SqlStatement}&SourceTable=${SourceTable}&SysSalesMan=${SysSalesMan}&SysPASman=${SysPASman}&SysBillsMan=${SysBillsMan}&SysJournalsMan=${SysJournalsMan}&SysPayablesMan=${SysPayablesMan}&ObjID=${ObjID}&Language=${Language}`, {headers: headers.utfHeader})
    }
  
  //#endregion

  //#region 

    // get keys
    // Mohammed Hamouda 4/1/2021

    LoadKeys(sqlStm) {
      return this.http.get(`${environment.endPoint}Generic/LoadKeys?SQLStatment=${sqlStm}`, {headers: headers.utfHeader})
    }

  //#endregion

  //#region 

    // download report
    // Mohammed Hamouda 4/1/2021

    downloadReport(type, repid, repcrit, reptitle, lang, compName, branchName) {
      return this.http.get(`${environment.endPoint}Report/ViewReport?type=${type}&repid=${repid}&repcrit=${repcrit}&reptitle=${reptitle}&replanguage=${lang}&CompanyName=${compName}&BranchName=${branchName}`, { responseType: "blob" })
    }

  //#endregion 
  
  //#region 

    // save & update record
    // Mohammed Hamouda 4/1/2021

    saveRecord(object, SourceTable, Mode, UserName,gridindex,masters,childs,keycols,gridcolnum ,gridrowlnum,m_IDCol,gridTableName,BeforeCommitObject) {     
      return this.http.post(`${environment.endPoint}Generic/SaveRecord?SourceTable=${SourceTable}&Mode=${Mode}&UserName=${UserName}&gridindex=${gridindex}&masters=${masters}&childs=${childs}&keycols=${keycols}&gridcolnum=${gridcolnum}&gridrowlnum=${gridrowlnum}&m_IDCol=${m_IDCol}&gridTableName=${gridTableName}&BeforeCommitObject=${BeforeCommitObject}`, object, {headers: headers.utfHeader})
    }

  //#endregion 
  
  //#region 

    // get parents
    // Mohammed Hamouda => 5/1/2021

    getParents(){
      return this.http.get(`${environment.endPoint}FrmCostCenters/getParents`, {headers: headers.utfHeader})
    }

  //#endregion

  //#region 

    // get parents
    // Mohammed Hamouda => 5/1/2021

    getCostItemsTypes(sql){
      return this.http.get(`${environment.endPoint}Generic/LoadCostItemsTypes?SQLStatment=${sql}`, {headers: headers.utfHeader})
    }

  //#endregion
  
  //#region 

  // load form - for search
  // Mohammed Hamouda - 13/01/2021

  searchDv(sql) {
    return this.http.get(`${environment.endPoint}Generic/LoadPopUp?SQLStatement=${sql}`, {headers: headers.utfHeader})
  }

  //#endregion

  //#region 

  // check if record used in other tabl
  // Mohammed Hamouda - 14/01/2021

  checkIfUsed(TableName,  Column,  Criteria) {
    return this.http.get(`${environment.endPoint}Generic/DCounthttp?TableName=${TableName}&Column=${Column}&Criteria=${Criteria}`, {headers: headers.noAuthHeader})
  }

  //#endregion

  //#region 

  // get branches
  // Mohammed Hamouda 17/01/2021

  getbranches() {
    return this.http.get(`${environment.endPoint}login/GetBranchesNames`);
  }

  //#endregion

  //#region 

  // get data to be approved
  // Mohammed Hamouda - 17/01/2021

  getDataToBeApproved(ObjectId, ComboBranchCode, datevalue) {
    return this.http.get(`${environment.endPoint}FrmPmtApprove/FormLoad?ObjectId=${ObjectId}&ComboBranchCode=${ComboBranchCode}&date=${datevalue}`, {headers: headers.noAuthHeader});
  }

  //#endregion

  //#region 

  // execute sql stm
  // Mohammed Hamouda - 17/01/2021

  execQuery(stm) {
    return this.http.get(`${environment.endPoint}Generic/execQuery?sqlcommand=${stm}`, {headers: headers.noAuthHeader});
  }

  execQueryAsPromise(stm) {
    return this.http.get(`${environment.endPoint}Generic/execQuery?sqlcommand=${stm}`, {headers: headers.noAuthHeader}).toPromise();
  }

  //#endregion

  //#region 

  // notify
  // Mohammed Hamouda - 18/01/2021

  Notify(EventID, Msg) {
    return this.http.get(`${environment.endPoint}FrmPmtApprove/Notify?EventID=${EventID}&Msg=${Msg}`, {headers: headers.noAuthHeader});
  }

  //#endregion

  //#region 

  // get date from server
  // Mohammed Hamouda

  getCurrentDate(format: string) {
    console.log(`${environment.endPoint}Generic/getCurrentDate?Dateformat=${format}`);
    return this.http.get(`${environment.endPoint}Generic/getCurrentDate?Dateformat=${format}`, {headers: headers.noAuthHeader});
  }

  //#endregion

  //#region 

  // get open transactions
  // Mohammed Hamouda - 18/01/2021

  getDataToBeCanceled(ObjectId,  ComboBranchCode,  date) {
    return this.http.get(`${environment.endPoint}FrmOpenTransactions/FormLoad?ObjectId=${ObjectId}&ComboBranchCode=${ComboBranchCode}&date=${date}`, {headers: headers.noAuthHeader});
  }

  //#endregion

  //#region 

  // working with reports
  // Mohammed Hamouda - 21/01/2021

  getCriteriaFieldsSources(id) {
    return this.http.get(`${environment.endPoint}Report/Get_CriteriaFieldsSources?id=${id}`, {headers: headers.noAuthHeader});
  }

  setReport(id) {
    return this.http.get(`${environment.endPoint}Report/SetReport?ReportId=${id}`, {headers: headers.noAuthHeader});
  }

  getcriteriasss(sql) {
    return this.http.get(`${environment.endPoint}Report/getcriteriasss?sql=${sql}`, {headers: headers.noAuthHeader});
  }

  getReport(type, repid, repcrit, reptitle, replanguage, companyName, branchName) {  
    return this.http.get(`${environment.endPoint}Report/ViewReport?type=${type}&repid=${repid}&repcrit=${repcrit}&reptitle=${reptitle}&replanguage=${replanguage}&CompanyName=${companyName}&BranchName=${branchName}`, { responseType: "blob" });
  }

  setDownloadedRepPath(type, repid, repcrit, reptitle, replanguage, companyName, branchName) {
    return `${environment.endPoint}Report/ViewReport?type=${type}&repid=${repid}&repcrit=${repcrit}&reptitle=${reptitle}&replanguage=${replanguage}&CompanyName=${companyName}&BranchName=${branchName}`;
  }

  //#endregion

  //#region 

  // Loadform
  // Mohammed Hamouda - 25/01/2021

  loadForm() {
    return this.http.get(`${environment.endPoint}Forms/LoadForm`, {headers: headers.noAuthHeader});
  }

  //#endregion

  //#region 

  // user auth
  // Mohammed Hamouda - 27/01/2021

  userAuth(UserName, BranchCode, Password) {
    return this.http.get(`${environment.endPoint}login/Login?UserName=${UserName}&BranchCode=${BranchCode}&Password=${Password}`, {headers: headers.noAuthHeader});
  }

  // system vars
  // Mohammed Hamouda - 31/01/2021

  loadSystemVariables(UserName, BranchCode) {
    return this.http.get(`${environment.endPoint}Generic/LoadSystemVariables?UserName=${UserName}&BranchCode=${BranchCode}`, {headers: headers.noAuthHeader});
  }

  //#endregion

  //#region // systym security

  // change password
  // Mohammed Hamouda - 01/02/2021

  changePassword(NewPassword, UserName, OldPassword) {
    return this.http.get(`${environment.endPoint}FrmChangePwd/ChangePassword?NewPassword=${NewPassword}&UserName=${UserName}&OldPass=${OldPassword}`, {headers: headers.noAuthHeader});
  }

  // get system preferences
  // Mohammed Hamouda - 02/02/2021

  getSystemPreferences() {
    return this.http.get(`${environment.endPoint}FrmSystem/FrmSystemFormLoad`, {headers: headers.noAuthHeader});
  }

  // get VAT
  // Mohammed Hamouda - 03/02/2021

  getVAT() {
    return this.http.get(`${environment.endPoint}FrmSystem/GetVAT_IN_ItemCode`, {headers: headers.noAuthHeader});
  }

  // get posting and unposting data
  // Mohammed Hamouda - 03/01/2021

  postUpostFormLoad() {
    return this.http.get(`${environment.endPoint}FrmPosting/FormLoad`, {headers: headers.noAuthHeader});
  }

  applayPostingOrUnposting(IsPosting, date, Checked, branchCode, UserName) {
    return this.http.get(`${environment.endPoint}FrmPosting/ApplyPost_UnPost?IsPosting=${IsPosting}&date=${date}&Checked=${Checked}&branchCode=${branchCode}&UserName=${UserName}`, {headers: headers.noAuthHeader});
  }

  // get events

  getEvents() {
    return this.http.get(`${environment.endPoint}FrmNotif/GetAllEvents`, {headers: headers.noAuthHeader});
  }

  // get avilable user at event

  getAvailableUsersAtEvent(id) {
    return this.http.get(`${environment.endPoint}FrmNotif/GetAvailableUsers?EventId=${id}`, {headers: headers.noAuthHeader});
  }

  getSelectedUsersAtEvent(id) {
    return this.http.get(`${environment.endPoint}FrmNotif/GetSelectedUsers?EventId=${id}`, {headers: headers.noAuthHeader});
  }

  //#endregion

  //#region 

  // get max num of records
  // Mohammed Hamouda - 11/02/2021

  getMaxNumOfRecords(TableName, Column, Criteria) {
    return this.http.get(`${environment.endPoint}/Generic/DMaxHttp?TableName=${TableName}&Column=${Column}&Criteria=${Criteria}`, {headers: headers.noAuthHeader})
  }

  checkTradeLicense(TableName, Column, Criteria) {
    return this.http.get(`${environment.endPoint}/Generic/DCounthttp?TableName=${TableName}&Column=${Column}&Criteria=${Criteria}`, {headers: headers.noAuthHeader})
  }  

  //#endregion

  //#region 

  // send mail for customer request
  // Mohammed Hamouda - 14/02/2021

  customersRequestsNotify(Msg, Glb_Branch_Name, Glb_User_Name, EventID) {
    return this.http.get(`${environment.endPoint}/FrmCustomersRequests/Notify?Msg=${Msg}&Glb_Branch_Name=${Glb_Branch_Name}&Glb_User_Name=${Glb_User_Name}&EventID=${EventID}`, {headers: headers.noAuthHeader})
  }

  //#endregion

  //#region 

  // get grid pop up data
  // Mohammed Hamouda - 21/02/2021

  LoadPopUpCheck(SQLStatment,  Criteria) {
    return this.http.get(`${environment.endPoint}Generic/LoadPopUpCheck?SQLStatment=${SQLStatment}&Criteria=${Criteria}`, {headers: headers.noAuthHeader})
  }

  //#endregion

  //#region 

  // sales order auth
  // Mohammed Hamouda - 21/02/2021

  frmSalesOrderLoad(BranchCode, UserName) {
    return this.http.get(`${environment.endPoint}FrmSalesOrders/frmSalesOrderLoad?BranchCode=${BranchCode}&UserName=${UserName}`, {headers: headers.noAuthHeader})
  }

  //#endregion

  test() {
    let formData = new FormData();
    formData.append("AppSid", "KSdcmtnTPgkLRF5Rvf7ynrI8kWv_G");
    formData.append("msg", "Hello Tarek");
    formData.append("Recipient", "966509003950");
    formData.append("sender", "SAUDISOFT");
    formData.append("encoding", "UCS2");
    formData.append("Body", "test");

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization' : 'Basic ' + 'mis@saudisoft.com:KSdcmtnTPgkLRF5Rvf7ynrI8kWv_G'
      })
    };

    return this.http.post('https://basic.unifonic.com/rest/SMS/messages', formData, httpOptions);
  }
  
}
