import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { FrmService } from 'src/services/frm/frm.service';
import { DatabindingService } from 'src/services/databinding.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {operators} from './../../../settings/operators';
import * as repOptions from './../../../settings/reportOptions';
import * as lang from './../../../settings/lang';
import * as $ from 'jquery';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, OnChanges {
  @Input('repID') repID;
  @Input('repName') repName;
  reportForm!: FormGroup;
  listOfCriteriaControls: Array<{ 
    id: any,
    criteriaFieldsControlInstance: any, 
    criteriaOperatorControlInstance: any, 
    criteriaValueControlInstance: any,
    criteriaOptionControlInstance: any,
    criteriaDateControlInstance: any,
    criteriaMemoControlInstance: any
  }> = [];
  lang;
  searchValue;
  searchOperator = "=";
  listOfOptons: any = [];

  criteria: any = [];
  operators = operators;   
  repOptions = repOptions.options;
  selectedRepOption = 0
  isSearching = false;
  isDbLoading = false;
  isTableSearch= false;
  isLoading = true;
  isDate = false;

  sqlArrIndex: any;
  sqlArr: any = [];
  arrOfDates: any = [];
  data: any = [];
  original: any = [];
  tblData: any = [];
  isLoadDataForPoUp: boolean = false;
  isVisible: boolean = false;

  controlID: any;

  constructor(
    private service: FrmService, 
    private binding: DatabindingService,
    private notification: NzNotificationService,  
    private fb: FormBuilder) { }

  ngOnInit() {
    //#region 
      // Dynamic form
      // Mohammed Hamouda - 250/01/2021

      this.reportForm = this.fb.group({});
    //#endregion

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
      
    this.getReport(this.repID);
  }

  //#region 

    // check lang

    getLang() {
      return localStorage.getItem('lang');
    }

  //#endregion

  //#region 

    // Add dynamic control & remove according to user selection
    // Mohammed Hamouda - 20/01/2021

    addField(e?: MouseEvent): void {
      if (e) {
        e.preventDefault();
      }

      const id = this.listOfCriteriaControls.length > 0 ? this.listOfCriteriaControls[this.listOfCriteriaControls.length - 1].id + 1 : 0;
      
      const criteriaFieldControl = {
        id, 
        criteriaFieldsControlInstance: `criteriaFieldId-${id}`,
        criteriaOperatorControlInstance: `criteriaOperatorId-${id}`,
        criteriaValueControlInstance: `criteriaValueId-${id}`,
        criteriaOptionControlInstance: `criteriaOptionId-${id}`,
        criteriaDateControlInstance: `criteriaDateId-${id}`,
        criteriaMemoControlInstance: `criteriaMemoId-${id}`
      };

      const index = this.listOfCriteriaControls.push(criteriaFieldControl);
      const options = this.listOfOptons.push({controlName: criteriaFieldControl.criteriaOptionControlInstance, value: ''}); 

      for (let i = 0; i <= index - 1; i ++) {
        this.reportForm.addControl(this.listOfCriteriaControls[index - 1].criteriaFieldsControlInstance, new FormControl(this.criteria[0].criteria.original));
        this.reportForm.addControl(this.listOfCriteriaControls[index - 1].criteriaOperatorControlInstance, new FormControl("="));
        this.reportForm.addControl(this.listOfCriteriaControls[index - 1].criteriaValueControlInstance, new FormControl(null));
        this.reportForm.addControl(this.listOfCriteriaControls[index - 1].criteriaOptionControlInstance, new FormControl(null));
        this.reportForm.addControl(this.listOfCriteriaControls[index - 1].criteriaDateControlInstance, new FormControl(null));
        this.reportForm.addControl(this.listOfCriteriaControls[index - 1].criteriaMemoControlInstance, new FormControl(null));           
      } 

    }

    removeField(i: { 
      id: any; 
      criteriaFieldsControlInstance: any, 
      criteriaOperatorControlInstance: any, 
      criteriaValueControlInstance: any,
      criteriaOptionControlInstance: any,
      criteriaDateControlInstance: any,
      criteriaMemoControlInstance: any
    }, e: MouseEvent): void {
      e.preventDefault();
      if (this.listOfCriteriaControls.length > 1) {
        const index = this.listOfCriteriaControls.indexOf(i);
        this.listOfCriteriaControls.splice(index, 1);
        this.reportForm.removeControl(i.criteriaFieldsControlInstance);
        this.reportForm.removeControl(i.criteriaOperatorControlInstance);
        this.reportForm.removeControl(i.criteriaValueControlInstance);
        this.reportForm.removeControl(i.criteriaOptionControlInstance);
        this.listOfOptons.splice(index, 1) 
      }

    }

    renderItem(index) { // when user select and || or

      const getCurrentControl = this.listOfCriteriaControls[index].criteriaOptionControlInstance;
      this.listOfOptons[index].controlName = getCurrentControl;

      let newValue = this.reportForm.get(getCurrentControl).value;  

      if (newValue == null)
        return;

      if (this.listOfOptons[index].value == '' || this.listOfOptons.length == 1)
        this.addField();        

      this.listOfOptons[index].value = newValue;
      
    }

  //#endregion

  //#region 

    // get Criteria
    // Mohammed Hamouda - 20/01/2021

    getReport(id) {
      this.isDbLoading = true;
      this.isLoading = true;

      this.service.setReport(id).subscribe(
        res => {
          this.listOfCriteriaControls = [];
          this.listOfOptons = []; 

          this.criteria = res;
          
          this.isDbLoading = false;

          this.addField();

          this.isLoading = false;
        },
        err => {console.log(err)}
      )
    }

  //#endregion

  //#region 

    // get Criteria data
    // Mohammed Hamouda 21/01/2021

    getCriteria() {
      this.service.getCriteriaFieldsSources(this.repID, localStorage.getItem('username')).subscribe(
        res => {
          this.sqlArr = res;
        }
      )
    }

  //#endregion

  //#region 

    // fill pop data when user click on the button
    // Mohammed Hamouda 24/01/2021

    fillPopUp(controlID) {
      let criteriaFieldValue = this.reportForm.get(`criteriaFieldId-${controlID}`).value;
      this.sqlArrIndex = this.criteria.findIndex(index => index.criteria.original == criteriaFieldValue);
      let query = (this.sqlArr[this.sqlArrIndex].includes('DISTINCT')) 
                    ? this.sqlArr[this.sqlArrIndex].replace("SELECT DISTINCT", "SELECT DISTINCT TOP 100") 
                    : this.sqlArr[this.sqlArrIndex].replace("SELECT", "SELECT TOP 100")

      this.controlID = controlID;

      this.isLoadDataForPoUp = true;

      this.service.getcriteriasss(query).subscribe(
        res => {
          let data: any = res;
          if (query.includes('TransDate')) {
            this.data = data.map((val) => {
              return {TransDate: this.formatDate(val.TransDate)}
            });
          } else {
            this.data = res;
          }
          
          this.isLoadDataForPoUp = false;

          this.isVisible = true;
        },
        err => {
          this.isLoadDataForPoUp = false;
          console.log(err);
        }
      )

    }

  //#endregion

  //#region 

    // close the pop up
    // Mohammed Hamouda - 24/01/2021

    handleCancel(){
      this.isVisible = false;
    }

  //#endregion

  // this function is used to recive data from table pagination
  tblPageChangeHandler(data){
    this.tblData = data;
  }

  // check when user click a row  

  onItemClicked(index) {
    let keys = Object.keys(this.tblData[index]); 
    this.reportForm.get(`criteriaValueId-${this.controlID}`).setValue(this.tblData[index][keys[0]]);
    this.isVisible = false;
  }

  
  //#region 

    // table search with reset function
    // Mohammed Hamouda - 13/01/2021

    filterData(searchKey, val) {
      let originalQueryWithOutOrderBy = this.sqlArr[this.sqlArrIndex].toUpperCase().split("ORDER BY")[0];
      let query = `Select * From (${originalQueryWithOutOrderBy}) as tblResult Where tblResult.${searchKey} like '**${val}**'`;
      this.original = this.data;
      this.isTableSearch = true;
  
      this.service.searchDv(query).subscribe(
        res => {
          let data: any = res      
          if(data.length > 0) {
            this.data = data;
  
          } else {
            this.data = [];
          }
          this.isTableSearch = false;
        }
      )
    }
  
    reset() {
      this.data = this.original;
      this.original = [];
    }
  //#endregion

  //#region 

    // run and display report
    // Mohammed Hamouda - 214/01/2021

    runRep() {
      let criteriaArray: any[] = [];
      let criteriaToBeSent: string = "";
      let check: boolean = false;
   
      this.isLoading = true; 

      for (let i = 0; i <= this.listOfCriteriaControls.length -1; i++) { // check that every form control is valid
        if (this.reportForm.get(`criteriaValueId-${i}`).value != null) {        
          criteriaArray.push(`${this.reportForm.get(`criteriaFieldId-${i}`).value}^^^${this.reportForm.get(`criteriaOperatorId-${i}`).value}^^^${this.reportForm.get(`criteriaValueId-${i}`).value}^^^${null}^^^${(this.reportForm.get(`criteriaOptionId-${i}`).value == null) ? 'And' : this.reportForm.get(`criteriaOptionId-${i}`).value}`)
          check = true;
        } else { // check date value
          if (this.reportForm.get(`criteriaDateId-${i}`).value != null) { // if there is any invalid control
            criteriaArray.push(`${this.reportForm.get(`criteriaFieldId-${i}`).value}^^^${this.reportForm.get(`criteriaOperatorId-${i}`).value}^^^${this.formatDate(this.reportForm.get(`criteriaDateId-${i}`).value)}^^^${null}^^^${(this.reportForm.get(`criteriaOptionId-${i}`).value == null) ? 'And' : this.reportForm.get(`criteriaOptionId-${i}`).value}`)
            check = true;
          } else {
            if (this.reportForm.get(`criteriaMemoId-${i}`).value != null) {
              criteriaArray.push(`${this.reportForm.get(`criteriaFieldId-${i}`).value}^^^${this.reportForm.get(`criteriaOperatorId-${i}`).value}^^^${this.reportForm.get(`criteriaMemoId-${i}`).value}^^^${null}^^^${(this.reportForm.get(`criteriaOptionId-${i}`).value == null) ? 'And' : this.reportForm.get(`criteriaOptionId-${i}`).value}`)
              check = true;
            } else {
              this.isLoading = false; 
      
              let title = this.lang.reportValidationMsgTitle;
              let message = this.lang.reportValidationMsgDetails;
              let notification = "warning";
              let options = (localStorage.getItem('lang') == 'EN') ? {nzClass: 'lang-en'} : {nzClass: 'lang-ar'};
              this.notification.create(notification, title, message, options);  
              
              check = false;
            }
          }
        }
      }

      if (check) { 
        let system = JSON.parse(localStorage.getItem('systemVariables'));     
        criteriaToBeSent = criteriaArray.join(";");
              
        this.getRep( // calling the function that respond to report type (print, preview or download)
          this.selectedRepOption, 
          this.repID, 
          criteriaToBeSent, 
          this.repName, 
          localStorage.getItem('lang'), 
          system[0].Glb_CompanyName.toUpperCase(),
          `${system[1].Glb_Branch_Name.toUpperCase()} BRANCH`)
      }
      
    }

    // function that respond to report type (print, preview or download)

    getRep(type, repid, repcrit, reptitle, replanguage, companyName, branchName) {
      if (type == 11 || type == 0) {
    
        this.service.getReport(type, repid, localStorage.getItem('username'), repcrit, reptitle, replanguage, companyName, branchName).subscribe(
          res => {
            let url = window.URL.createObjectURL(res);

            this.isLoading = false;           

            if (this.selectedRepOption == 0) {
              window.open(url);
            } else {
              let printRep = window.open(url);
              printRep.print();
            }

            this.listOfCriteriaControls = [];
            this.listOfOptons = [];
            this.reportForm.reset();
            this.addField();
          },
          err => {
            console.log(err);
          }
        );
  
      } else {
        this.isLoading = false;
        window.open(this.service.setDownloadedRepPath(type, repid, localStorage.getItem('username'), repcrit, reptitle, replanguage, companyName, branchName));
      }
    }

  //#endregion

  //#region 

  getSelectedCriteria(val, i) {
    let index = this.criteria.findIndex(c => c.criteria.original == val);

    if(this.criteria[index].criteria.original.trim() === "Memo") {
      $(`#js_memo_${i}`).removeClass('d-none');
      $(`#js_${i}`).addClass('d-none');
      $(`#js_date_${i}`).addClass('d-none');
      this.reportForm.get(`criteriaValueId-${i}`).reset();
      this.reportForm.get(`criteriaDateId-${i}`).reset();
    } else {
      if (this.criteria[index].Type == "7" && this.sqlArr[index].trim() === "") {
        $(`#js_${i}`).addClass('d-none');
        $(`#js_memo_${i}`).addClass('d-none');
        $(`#js_date_${i}`).removeClass('d-none');
        this.reportForm.get(`criteriaValueId-${i}`).reset();
        this.reportForm.get(`criteriaMemoId-${i}`).reset();
      } else {
        $(`#js_${i}`).removeClass('d-none');
        $(`#js_date_${i}`).addClass('d-none');
        $(`#js_memo_${i}`).addClass('d-none');
        this.reportForm.get(`criteriaDateId-${i}`).reset();
        this.reportForm.get(`criteriaMemoId-${i}`).reset();
      }
    }

  }

  formatDate(date) { // format date
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

  //#region 

  // sort
  // Mohammed Hamouda - 14/03/2021

  sotrHandler(event) {
    this.data = event;
  }

  //#endregion  

  ngOnChanges(changes: SimpleChanges) {
    // check new data
    const isNewRepID = setInterval(() => {
      if (typeof (changes.repID) == 'undefined') {
        null;
      } else {
        this.repID = changes.repID.currentValue; 
        this.repName = changes.repName.currentValue;
        this.listOfCriteriaControls = [];
        this.listOfOptons = [];
        this.reportForm.reset();
        this.getReport(this.repID);
        this.getCriteria();
        clearInterval(isNewRepID);
      }
    }, 100);
  }

}
