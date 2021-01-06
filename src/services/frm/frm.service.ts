import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  
    getSecurity(ObjID, Glb_User_Name, Glb_Branch_Code, SqlStatement, SourceTable, SysSalesMan, SysPASman, SysBillsMan, SysJournalsMan, Language) {
      return this.http.get(`${environment.endPoint}Generic/SetSecurity?SQLStatment=${SqlStatement}&Glb_User_Name=${Glb_User_Name}&Glb_Branch_Code=${Glb_Branch_Code}&SqlStatement=${SqlStatement}&SourceTable=${SourceTable}&SysSalesMan=${SysSalesMan}&SysPASman=${SysPASman}&SysBillsMan=${SysBillsMan}&SysJournalsMan=${SysJournalsMan}&ObjID=${ObjID}&Language=${Language}`, {headers: headers.utfHeader})
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

}
