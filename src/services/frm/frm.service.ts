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

    DeleteRecord(SourceTable, masters, childs, gridIndex, gridrowlnum, gridcolnum, gridTableName, FormFieldsArray, UserName, BeforeCommitObject) {
      return this.http.post(`${environment.endPoint}Generic/DeleteRecord?SourceTable=${SourceTable}&masters=${masters}&childs=${childs}&gridIndex=${gridIndex}&gridrowlnum=${gridrowlnum}&gridcolnum=${gridcolnum}&gridTableName=${gridTableName}&UserName=${UserName}&BeforeCommitObject=${BeforeCommitObject}`, FormFieldsArray, {headers: headers.utfHeader})
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

    downloadReport(type, repid, UserName, repcrit, reptitle, lang, compName, branchName) {
      return this.http.get(`${environment.endPoint}Report/ViewReport?type=${type}&repid=${repid}&UserName=${UserName}&repcrit=${repcrit}&reptitle=${reptitle}&replanguage=${lang}&CompanyName=${compName}&BranchName=${branchName}`, { responseType: "blob" })
    }

  //#endregion 
  
  //#region 

    // save & update record
    // Mohammed Hamouda 4/1/2021

    saveRecord(object, SourceTable, Mode, UserName,gridindex,childs, masters,keycols,gridcolnum ,gridrowlnum,m_IDCol,gridTableName,BeforeCommitObject) {     
      return this.http.post(`${environment.endPoint}Generic/SaveRecord?SourceTable=${SourceTable}&Mode=${Mode}&UserName=${UserName}&gridindex=${gridindex}&childs=${childs}&masters=${masters}&keycols=${keycols}&gridcolnum=${gridcolnum}&gridrowlnum=${gridrowlnum}&m_IDCol=${m_IDCol}&gridTableName=${gridTableName}&BeforeCommitObject=${BeforeCommitObject}`, object, {headers: headers.utfHeader})
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

  Notify(EventID, Msg, branchName, Glb_User_Name) {
    return this.http.get(`${environment.endPoint}FrmPmtApprove/Notify?EventID=${EventID}&Msg=${Msg}&BranchName=${branchName}&UserName=${Glb_User_Name}`, {headers: headers.noAuthHeader});
  }

  //#endregion

  //#region 

  // get date from server
  // Mohammed Hamouda

  getCurrentDate(format: string) {
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

  getCriteriaFieldsSources(id, username) {
    return this.http.get(`${environment.endPoint}Report/Get_CriteriaFieldsSources?id=${id}&UserName=${username}`, {headers: headers.noAuthHeader});
  }

  setReport(id) {
    return this.http.get(`${environment.endPoint}Report/SetReport?ReportId=${id}`, {headers: headers.noAuthHeader});
  }

  getcriteriasss(sql) {
    return this.http.get(`${environment.endPoint}Report/getcriteriasss?sql=${sql}`, {headers: headers.noAuthHeader});
  }

  getReport(type, repid, UserName, repcrit, reptitle, replanguage, companyName, branchName) {  
    return this.http.get(`${environment.endPoint}Report/ViewReport?type=${type}&repid=${repid}&UserName=${UserName}&repcrit=${repcrit}&reptitle=${reptitle}&replanguage=${replanguage}&CompanyName=${companyName}&BranchName=${branchName}`, { responseType: "blob" });
  }

  setDownloadedRepPath(type, repid, UserName, repcrit, reptitle, replanguage, companyName, branchName) {
    return `${environment.endPoint}Report/ViewReport?type=${type}&repid=${repid}&{UserName}=${UserName}&repcrit=${repcrit}&reptitle=${reptitle}&replanguage=${replanguage}&CompanyName=${companyName}&BranchName=${branchName}`;
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

  // order items
  // Mohammed Hamouda - 28/02/2021

  gridData(SQL, criteria) {
    return this.http.get(`${environment.endPoint}Generic/GetGridData?SqlStatment=${SQL}&criteria=${criteria}`, {headers: headers.noAuthHeader}).toPromise();
  }

  voucherGridData(criteria) {
    return this.http.get(`${environment.endPoint}FrmVouchers/GetGridData?criteria=${criteria}`, {headers: headers.noAuthHeader}).toPromise();
  }

  //#endregion

  //#region 

  // get vat
  // Mohammed Hamouda - 24/02/2021

  getDlk(custCode) {
    return this.http.get(`${environment.endPoint}FrmSalesOrders/getDlk?CustCode=${custCode}`, {headers: headers.noAuthHeader}).toPromise();
  }

  getVATRatio(vatDate, glbVATITemCode) {
    return this.http.get(`${environment.endPoint}FrmSalesOrders/GetVAT_Ratio?EffectiveDate=${vatDate}&Glb_VAT_ItemCode=${glbVATITemCode}`, {headers: headers.noAuthHeader}).toPromise();
  }

  //#endregion

  //#region 

  // get info about table
  // Mohammed Haouda - 03/03/2021

  tblInfo(TableName,  Columns,  Criteria,  GroupBy,  Having,  OrderBy,  TopRecords,   Distinct) {
    return this.http.get(`${environment.endPoint}Generic/DLookUphttp?TableName=${TableName}&Columns=${Columns}&Criteria=${Criteria}&GroupBy=${GroupBy}&Having=${Having}&OrderBy=${OrderBy}&TopRecords=${TopRecords}&Distinct=${Distinct}`, {headers: headers.noAuthHeader}).toPromise();
  }

  //#endregion

  //#region 

  // check posting
  // Mohammed Hamouda => 08/03/2021

  checkPosting(TKey, TNum, TCode, TDate, TTable, Glb_Branch_Code) {
    return this.http.get(`${environment.endPoint}Generic/CheckPosting?TKey=${TKey}&TNum=${TNum}&TCode=${TCode}&TDate=${TDate}&TTable=${TTable}&Glb_Branch_Code=${Glb_Branch_Code}`, {headers: headers.noAuthHeader}).toPromise();
  }

  //#endregion

  //#region 

  // check number of usage
  // Mohammed Hamouda => 08/03/2021

  numberOfUsage(TableName,  Column,  Criteria) {
    return this.http.get(`${environment.endPoint}Generic/DCounthttp?TableName=${TableName}&Column=${Column}&Criteria=${Criteria}`, {headers: headers.noAuthHeader}).toPromise();
  }

  //#endregion

  //#region 

  // get MRNs
  // Mohammed Hamouda - 18/03/2021

  getDataFrmVoucher(serial) {
    return this.http.get(`${environment.endPoint}FrmVouchers/GetDataFrmVoucher?serial=${serial}`, {headers: headers.noAuthHeader}).toPromise();
  }

  //#endregion

  //#region 

  // create MRN
  // Mohammed Hamouda - 21/03/2021

  CreateMRN(MtnNum, sdcStoreCode, BranchCode, UserName, CalCost) {
    return this.http.get(`${environment.endPoint}FrmVouchers/CreateMRN?MTN=${MtnNum}&sdcStoreCode=${sdcStoreCode}&BranchCode=${BranchCode}&UserName=${UserName}&CalCost=${CalCost}`, {headers: headers.noAuthHeader}).toPromise();
  }

  //#endregion

  //#region 

  // sum
  // Mohammed Hamouda - 23/03/2021

  DSum(TableName, Column,Criteria) {
    return this.http.get(`${environment.endPoint}Generic/DSumhttp?TableName=${TableName}&Column=${Column}&Criteria=${Criteria}`, {headers: headers.noAuthHeader}).toPromise();
  }

  //#endregion

  //#region 

  // load popup data
  // Mohammed Hamouda - 25/03/2021

  loadPopUpCheckvalue(SQLStatment, value, Criteria) {
    return this.http.get(`${environment.endPoint}Generic/LoadPopUpCheckvalue?SQLStatment=${SQLStatment}&value=${value}&Criteria=${Criteria}`, {headers: headers.noAuthHeader}).toPromise();
  }

  GetGridDataVoucher(criteria) {
    return this.http.get(`${environment.endPoint}FrmVouchers/GetGridData?criteria=${criteria}`, {headers: headers.noAuthHeader}).toPromise();
  }

  //#endregion

  //#region 

  // get item balance
  // Mohammed Hamouda - 28/03/2021

  getItemBalance(ItemCode,  StoreCode,  TransDate) {
    return this.http.get(`${environment.endPoint}FrmVouchers/GetItemBalance?ItemCode=${ItemCode}&StoreCode=${StoreCode}&TransDate=${TransDate}`, {headers: headers.noAuthHeader}).toPromise();
  }

  //#endregion
  
}
