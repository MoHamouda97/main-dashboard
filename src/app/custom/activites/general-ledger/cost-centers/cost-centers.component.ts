import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DatabindingService } from 'src/services/databinding.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as lang from './../../../../../settings/lang';
import { FrmService } from 'src/services/frm/frm.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as $ from 'jquery';
import { Subject } from 'rxjs/Subject';
import { shareReplay, take, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-cost-centers',
  templateUrl: './cost-centers.component.html',
  styleUrls: ['./cost-centers.component.css']
})
export class CostCentersComponent implements OnInit, OnDestroy {
  costCenterForm: FormGroup;
  lang;
  data;
  sql;
  sqlStm;
  userRights;
  selectedRep; 
  isNewLoad = true;
  isNewTLoad = true;
  isLoading = true;
  isCodeDisabled = false;
  isDisabled = false;
  isParentDisabled = false;
  isChecked = false;
  isVisible = false;
  isRepVisible = false;

  // dictionary var
  dictionary;
  title;
  centerCode;
  centerName;
  centerParent;
  centerParentName;
  centerLevel;
  centerFinal;
  IssuedBy;
  DateCreated;
  DateModified;

  titleWord;
  centerCodeWord;
  centerNameWord;
  centerParentWord;
  centerParentNameWord;
  centerLevelWord;
  centerFinalWord; 
  IssuedByWord; 
  DateCreatedWord;
  DateModifiedWord;

  // reports var
  lines;
  repIDs:any[] = [];
  repTitles:any[] = [];
  repObj:any[] = [];
  isDisplayRep = false;
  isPrintRip = false;

  // form title
  whatMode

  // combo box obj
  parents;

  destroyed = new Subject();

  subscription: Subscription;


  constructor(
    private binding: DatabindingService, 
    private service: FrmService, 
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.costCenterForm = this.fb.group({
      CenterCode: [null],
      CenterName: [null],
      CenterParent: [null],
      parentname: [null],
      CenterLevel: [null],
      CenterIsFinal: [null]
    }); 

    console.log(this.costCenterForm);
    
    //#region 

      // user authorization
      // Mohammed Hamouda - 4/1/2021

      this.sql = JSON.parse(localStorage.getItem("SQL")).filter(stm => stm.objName == "FrmCostCenters");
      this.sqlStm = this.sql[0].SQL;      
      this.getSecurity(
        localStorage.getItem('objID'),
        localStorage.getItem('username'),
        localStorage.getItem('branchCode'),
        this.sqlStm,
        "CostCenters",
        localStorage.getItem('username'),
        localStorage.getItem('username'),
        localStorage.getItem('username'),
        localStorage.getItem('username'),
        localStorage.getItem("lang"),
      );

    //#endregion
    
    //#region 

        // dealing with page language
        // Mohammed Hamouda - 29/12/2020 => v1 (detect language changing)
        // Mohammed Hamouda - 29/12/2020 => v2 (translate words from dictionary)

        // dictionary words
        this.setWordsObject();

        (localStorage.getItem('lang') == 'EN') ? this.translateToEN() : this.translateToAr();

        this.binding.checkIsLangChanged.subscribe(
          res => {
            if (res != null) {
              this.lang = (res == 'EN') ? lang.en : lang.ar;
              (res == 'EN') ? this.translateToEN() : this.translateToAr();
            }              
          }
        );

        this.lang = (localStorage.getItem('lang') == 'EN') ? lang.en : lang.ar;

    //#endregion
    
    //#region 

        // recive data from search component
        // Mohammed Hamouda - 30/12/2020 => v1 (detect when search data send data)

        this.binding.checkSendingDataFromSearch.subscribe(
          res => {
            if (res != null) {
              if (res.length > 0) {                
                this.binding.enableFunctions(true);
                (res.length == 1) ? this.ifLenghtIsOne(res) : this.ifLengthIsMore(res);
              }                
              else 
                this.arabicOrEnglishMessage(localStorage.getItem('lang'));  
            }
              
          }
        );

    //#endregion 
    
    //#region 

        // responding to task bar
        // Mohammed Hamouda - 31/12/2020 => v1 (detect when task bar did an action)
        // Mohammed Hamouda - 05/01/2021 => v2 (refresh search bar when detect any change && stop calling data)

        this.binding.checkDataReset.subscribe(
          res => {            
            if (res != null) {
              this.resetForm();
              document.getElementById('parent').removeAttribute('disabled');
              document.getElementById('centercode').removeAttribute('disabled');
              this.whatMode = "Add";

              // v2
              this.reInitSearchBar();
            }               
          }
        );

        this.binding.checkDelete.subscribe(
          res => {
            if (res != null && res != false)
              this.deleteRecord();
          }
        )

    //#endregion 

    //#region 

        // get report
        // Mohammed Hamouda - 4/1/2021

        this.binding.checkReport.subscribe(
          res => {
            if (res != null && res != false)
              this.getReport();
          }
        )

    //#endregion

    //#region 

      // Working with save & update
      // Mohammed Hamouda - 4/1/2021
      

      this.subscription = this.binding.checkSaveOrUpdate.pipe(takeUntil(this.destroyed)).subscribe(
        res => {
          if (res != null) {
            this.reInitTaskBar();
            this.saveOrUpdate(this.whatMode);
          }            
        }
      )      

    //#endregion

    // set form title
    this.whatMode = "Add";

    // get parents
    this.getParent();

  }

  //#region 

    // deal with length of data recived from search component
    // Mohammed Hamouda - 30/12/2020
    // Mohammed Hamouda - 05/01/2021 => v2 (refresh search bar when detect any change && stop calling data)

    ifLenghtIsOne(data: any) {
      this.costCenterForm.get('CenterCode').setValue(data[0].CenterCode);
      this.costCenterForm.get('CenterName').setValue(data[0].CenterName);
      this.costCenterForm.get('CenterParent').setValue(data[0].CenterParent);
      this.costCenterForm.get('parentname').setValue(data[0].ParentName);
      this.costCenterForm.get('CenterLevel').setValue(data[0].CenterLevel); 

      document.getElementById('centercode').setAttribute('disabled', 'true');
      document.getElementById('parent').removeAttribute('disabled');
      this.isDisabled = false;
      
      if (data[0].NumberOfChildren > 0) {
        this.costCenterForm.get('CenterIsFinal').setValue((data[0].CenterIsFinal == 1) ? true : false);

        document.getElementById('parent').setAttribute('disabled', 'true');
        document.getElementById('centercode').setAttribute('disabled', 'true'); 
        
        this.isDisabled = true;
        this.isParentDisabled = true;
      } else {
        this.costCenterForm.get('CenterIsFinal').setValue(false);
        this.isDisabled = false;
        this.isParentDisabled = false;
      }

      this.whatMode = "Edit";
    }

    ifLengthIsMore(data) {
      this.data = data.map((val) => {
        return {
          CenterCode: val.CenterCode,
          CenterName: val.CenterName,
          IssuedBy: val.IssuedBy,
          CenterParent: val.CenterParent,
          ParentName: val.ParentName,
          CenterLevel: val.CenterLevel,
          NumberOfChildren: val.NumberOfChildren,
          CenterIsFinal: val.CenterIsFinal,
          DateCreated: `${new Date(val.DateCreated).toLocaleString("en-US", {timeZone: "America/New_York"})}`,
          DateModified: `${new Date(val.DateModified).toLocaleString("en-US", {timeZone: "America/New_York"})}`,
        }
      });
      this.isVisible = true;    
    }

    // check when user click a row  

    onItemClicked(id) {
      let filtredData = this.data.filter(d => d.CenterCode == id)
      this.ifLenghtIsOne(filtredData);
      this.whatMode = "Edit";
      this.isVisible = false;

      // v2
      this.reInitSearchBar();
    }

    arabicOrEnglishMessage(lang) {
      let title = 'Search Result';
      let message = 'No Data for your Search';
      let options = {nzClass: 'lang-en'}

      if (lang == 'AR') {
        title = 'نتائج البحث';
        message = 'لا توجد بيانات لعملية البحث';
        options = {nzClass: 'lang-ar'}
      }

      this.notification.warning(title, message, options);
    }

  //#endregion

  //#region 

    // close modal

    handleCancel(){
      this.isVisible = false;
      this.isRepVisible = false;
      (this.data.length > 1 || this.costCenterForm.get("CenterCode").value == '') 
        ? null
        : this.binding.enableFunctions(false);
    }

  //#endregion

  //#region 

    // check lang

    getLang() {
      return localStorage.getItem('lang');
    }

    // set words object

    setWordsObject() {
      this.dictionary = JSON.parse(lang.lang);
      this.title = this.dictionary.filter(dic => dic.FieldName == 'Cost Centers');
      this.centerCode = this.dictionary.filter(dic => dic.FieldName == 'Center Code');
      this.centerName = this.dictionary.filter(dic => dic.FieldName == 'Center Name');
      this.centerParent = this.dictionary.filter(dic => dic.FieldName == 'CenterParent');
      this.centerParentName = this.dictionary.filter(dic => dic.FieldName == 'ParentName');
      this.centerLevel = this.dictionary.filter(dic => dic.FieldName == 'CenterLevel');
      this.centerFinal = this.dictionary.filter(dic => dic.FieldName == 'CenterIsFinal');
      this.IssuedBy = this.dictionary.filter(dic => dic.FieldName == 'IssuedBy');
      this.DateCreated = this.dictionary.filter(dic => dic.FieldName == 'DateCreated');
      this.DateModified = this.dictionary.filter(dic => dic.FieldName == 'DateModified');
    }

    // translate to EN

    translateToEN() {
      this.titleWord = this.title[0].LatinCap;
      this.centerCodeWord = this.centerCode[0].LatinCap;
      this.centerNameWord = this.centerName[0].LatinCap;
      this.centerParentWord = this.centerParent[0].LatinCap;
      this.centerParentNameWord = this.centerParentName[0].LatinCap;
      this.centerLevelWord = this.centerLevel[0].LatinCap;
      this.centerFinalWord = this.centerFinal[0].LatinCap;
      this.IssuedByWord = this.IssuedBy[0].LatinCap;
      this.DateCreatedWord = this.DateCreated[0].LatinCap;
      this.DateModifiedWord = this.DateModified[0].LatinCap;
    }

    // translate to AR

    translateToAr() {
      this.titleWord = this.title[0].ArabicCap;
      this.centerCodeWord = this.centerCode[0].ArabicCap;
      this.centerNameWord = this.centerName[0].ArabicCap;
      this.centerParentWord = this.centerParent[0].ArabicCap;
      this.centerParentNameWord = this.centerParentName[0].ArabicCap;
      this.centerLevelWord = this.centerLevel[0].ArabicCap;
      this.centerFinalWord = this.centerFinal[0].ArabicCap;
      this.IssuedByWord = this.IssuedBy[0].ArabicCap;
      this.DateCreatedWord = this.DateCreated[0].ArabicCap;
      this.DateModifiedWord = this.DateModified[0].ArabicCap;
    }    

  //#endregion

  //#region 

    // handle delete
    // Mohammed Hamouda - 3/1/2021 - v1
    // Mohammed Hamouda => 4/1/2021 - v2 (call a function that return an array of form key and values)

    deleteRecord() {
      let data: any[] = this.returnArrayFromFormValues();
  
                  
      this.service.DeleteRecord('CostCenters', "", "", "", "", "", "", data).subscribe(
        res => {
          this.resetForm();
          this.binding.showMessage("delete");
          this.binding.enableFunctions(false);

          document.getElementById('parent').removeAttribute('disabled');
          document.getElementById('centercode').removeAttribute('disabled');

          this.whatMode = "Add";
        },
        err => {
          let title = 'Delete Result';
          let message = err.error.latin;
          let options = {nzClass: 'lang-en'}
    
          if (localStorage.getItem('lang') == "AR") {
            title = 'نتائج الحذف';
            message = err.error.arabic;
            options = {nzClass: 'lang-ar'}
          }
    
          this.notification.error(title, message, options);

          this.binding.showMessage("stopIcons")
        }
      )
    }

    resetForm() {
      this.isParentDisabled = false;
      this.isDisabled = false;
      
      this.costCenterForm.get('CenterCode').setValue("");
      this.costCenterForm.get('CenterName').setValue("");
      this.costCenterForm.get('CenterParent').setValue("");
      this.costCenterForm.get('parentname').setValue("");
      this.costCenterForm.get('CenterLevel').setValue("")
      this.costCenterForm.get('CenterLevel').setValue("CenterIsFinal");
    }   

  //#endregion
  
  //#region 

    // get security
    // Mohammed Hamouda - 4/1/2021

    getSecurity(
      ObjID, 
      Glb_User_Name, 
      Glb_Branch_Code, 
      SqlStatement, 
      SourceTable, 
      SysSalesMan, 
      SysPASman, 
      SysBillsMan, 
      SysJournalsMan, 
      Language) {      
      this.service.getSecurity(
        ObjID, 
        Glb_User_Name, 
        Glb_Branch_Code, 
        SqlStatement, 
        SourceTable, 
        SysSalesMan, 
        SysPASman, 
        SysBillsMan, 
        SysJournalsMan, 
        Language).subscribe(
        res => {
          let data: any = res;

          this.isLoading = false;
          this.userRights = data.userRights;
          
          localStorage.setItem("FormRecordSource", data.FormRecordSource);
          localStorage.setItem("HotPrintReports", data.HotPrintReports);

          this.sqlStm = data.FormRecordSource;
          
          if (this.sqlStm.includes(" PERCENT ")) {
            this.sqlStm.replace(" PERCENT "," ");
          } else {
            this.sqlStm.trim();
            if (this.sqlStm.indexOf("SELECT ") != 0)
              this.sqlStm = `SELECT * FROM ${this.sqlStm}`;

            this.sqlStm = this.sqlStm.slice(7)
            this.sqlStm.replace(/TOP 100/g,"");
            this.sqlStm = `SELECT TOP 100  ${this.sqlStm}`;
          }

          localStorage.setItem("sqlStm", this.sqlStm);
        }
      )
    }

  //#endregion

  //#region 

    // get report
    // Mohammed Hamouda - 4/1/2021

    getReport() {      
      const lines = localStorage.getItem('HotPrintReports').split(";");      

      this.repObj = lines.map((val, index) => {
        return {
          RepID: lines[index].split(',')[0],
          RepTitle: lines[index].split(',')[1],
          RepCri: `${lines[index].split(',')[3]}^^^=^^^${this.costCenterForm.get("CenterCode").value}^^^${null}^^^AND`
        }
      });

      this.isRepVisible = true;

      this.binding.getReport(false);
    }

  //#endregion 
  
  //#region 

    // highlight report report
    // select report to be printed
    // Mohammed Hamouda - 4/1/2021

    addHighLight(index) {
      // highlight selected rep
      $('body').on("click", '.rep-name', function() {
        $(this).addClass('highlight').siblings().removeClass('highlight')
      });
      
      // selected report
      this.selectedRep = this.repObj[index];
    }

    runRep(type) {
      this.isDisplayRep = true;
      this.runOrPrintRip(type)
    }

    printRep(type){
      this.isPrintRip = true;
      this.runOrPrintRip(type)
    }

    runOrPrintRip(type) {
      this.service.downloadReport(
        type, 
        this.selectedRep.RepID, 
        this.selectedRep.RepCri , 
        this.selectedRep.RepTitle,
        localStorage.getItem("lang"),
        localStorage.getItem("companyName"),
        localStorage.getItem("branchName")).subscribe(
        res => {
          let url = window.URL.createObjectURL(res);
          if (type == 0) {            
            window.open(url);
            this.isDisplayRep = false;
          } else {
            const repPrint = window.open(url);
            repPrint.print();
            this.isPrintRip = false;
          }

          this.isRepVisible = false;
        }
      )
    }

  //#endregion

  //#region 

    // save or update
    // Mohammed Hamouda - 4/1/2021

    saveOrUpdate(type) {
      let data: any[] = this.returnArrayFromFormValues();
      let validation = this.costCenterForm.status.toLowerCase();

      if (type == "Add") {
        data.push(["IssuedBy", localStorage.getItem('username')]);
        data.push(["DateCreate", ""]);
        data.push(["DateModified", ""]);
      }

      (validation == "valid") ? this.callBackEndToSaveOrUpdate(data, type) : this.binding.showMessage("invalid");
    }

    // call backend to save or update

    callBackEndToSaveOrUpdate(data, type) {
      this.service.saveRecord(data, "CostCenters", type, localStorage.getItem("username"), "", "", "", "", "", "", "", "", "").subscribe(
        res => {
          console.log(res);
          (type == "Edit") ? this.binding.showMessage("edit2") : this.binding.showMessage("add");
          (type == "Add") ? this.costCenterForm.reset() : null;
        },
        err => {
          let title = 'Somthing Wrong';
          let message = err.error.latin;
          let options = {nzClass: 'lang-en'}
    
          if (localStorage.getItem('lang') == "AR") {
            title = 'حدث خطأ';
            message = err.error.arabic;
            options = {nzClass: 'lang-ar'}
          }
    
          this.notification.warning(title, message, options);

          this.binding.showMessage("stopIcons")
        }
      )
    }

  //#endregion

  //#region 

    // return data from form as an arry
    // Mohammed Hamouda => v1

    returnArrayFromFormValues() {
      let data = [];
      data.push(["CenterCode", this.costCenterForm.get("CenterCode").value]);
      data.push(["CenterName", this.costCenterForm.get("CenterName").value]);
      data.push(["CenterParent", this.costCenterForm.get("CenterParent").value]);
      data.push(["CenterLevel", this.costCenterForm.get("CenterLevel").value]);
      data.push(["CenterIsFinal", (this.costCenterForm.get("CenterIsFinal").value == true) ? 1 : 0]);
      return data;
    }

  //#endregion

  //#region
  
    // get parents
    // Mohammed Hamouda => 5/1/2021

    getParent() {
      this.service.getParents().subscribe(
        res => {
          let data: any = res;
          this.parents = JSON.parse(data);
        }
      )
    }
  
  //#endregion

  //#region 

    // get value from drop down (combo box)
    // Mohammed Hamouda => 5/1/2021 - v1

    getValFromDropDown(index) {
      this.costCenterForm.get('CenterParent').setValue(this.parents[index].CenterCode);
      this.costCenterForm.get('parentname').setValue(this.parents[index].CenterName);
      this.costCenterForm.get('CenterLevel').setValue(parseInt(this.parents[index].CenterLevel) + 1)
    }

  //#endregion

  //#region 

    // re init search bar
    // Mohammed Hamouda - 05/01/2021

    reInitSearchBar() {
      this.isNewLoad = false;
      this.cdRef.detectChanges();
      this.isNewLoad = true;
      this.binding.getAllData(false);
    }

    reInitTaskBar() {
      this.isNewTLoad = false;
      this.cdRef.detectChanges();
      this.isNewTLoad = true;
    }


  //#endregion

  //#region 

    // search in parent
    // Mohammed Hamouda - 6/1/2021

    searchParent() {
      let search = this.parents.find(el => el.CenterCode == this.costCenterForm.get('CenterParent').value);
      if (typeof(search) != 'undefined') {
        this.costCenterForm.get('parentname').setValue(search.CenterName);
        this.costCenterForm.get('CenterLevel').setValue(parseInt(search.CenterLevel) + 1)
      } else {
        this.costCenterForm.get('parentname').reset();
        this.costCenterForm.get('CenterLevel').reset();
      }
    }

  //#endregion

  ngOnDestroy() {
    this.binding.enableFunctions(false);
    this.destroyed.next(true);
    this.destroyed.complete();
    this.binding.showMessage(null);    
  }

}
