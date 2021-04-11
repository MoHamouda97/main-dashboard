import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FrmService } from 'src/services/frm/frm.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as lang from './../../../../settings/lang';
import { DatabindingService } from 'src/services/databinding.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as $ from 'jquery';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {
  // form
  systemPreferencesForm: FormGroup;

  // handel visability
  isUpdating: boolean = false;
  isLoading: boolean = true;
  isVisible: boolean = false;

  // language
  lang: any;

  // images
  logo: any = '';
  uploadedLogo: any = '';
  
  smLogo: any = '';
  uploadedSmLogo: any = '';

  waterMark: any = '';
  uploadedWatermark: any = '';

  // VAT vars
  data: any = [];
  VATType: any = '';

  // cuurent system variables
  system: any = JSON.parse(localStorage.getItem('systemVariables'));

  constructor (
    private fb: FormBuilder, 
    private service: FrmService, 
    private notification: NzNotificationService,
    private binding: DatabindingService,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    // init form
    this.systemPreferencesForm = this.fb.group({
      BranchCode: [""],
      CompanyName: [""],
      CompanyArabicName: [""],
      HeadOffice: [""],
      ArabicHeadOffice: [""],      
      TransCount: [""],
      BeginYear: [""],
      VAT_No: [""],
      VAT_IN_ItemCode: [""],
      VAT_ItemCode: [""],
      UseManufacturing: [false],
      LockCompletedSOF: [false],
      GLEntriesForMTN: [false],
      UseSales: [false],
      UsePurchs: [false],
      UseStocks: [false],
      AutoCalcVAT: [false],
      PreventInvWithoutIssue: [false],
      UseAccounts: [false],
      UseBanks: [false],
      UseNotifications: [false],
      VerifyItemAccounts: [false],
      Logo: [""],
      Small_Logo: [""],
      WaterMark: [""]
    });

    // responding to language change
    this.binding.checkIsLangChanged.subscribe(
      res => {
        if (res != null) {
          this.lang = (res == 'EN') ? lang.en : lang.ar;
        }              
      }
    );

    this.lang = (localStorage.getItem('lang') == 'EN') ? lang.en : lang.ar;

    this.getSystemData();
  }

  //#region 

  // system preferences
  getSystemData() {
    this.service.getSystemPreferences().subscribe(
      res => {
        let data: any = res;

        // fill form with data
        this.systemPreferencesForm.get("BranchCode").setValue(data[0]["BranchCode"]);
        this.systemPreferencesForm.get("CompanyName").setValue(data[0]["CompanyName"]);
        this.systemPreferencesForm.get("CompanyArabicName").setValue(data[0]["CompanyArabicName"]);

        this.systemPreferencesForm.get("HeadOffice").setValue(data[0]["HeadOffice"]);
        this.systemPreferencesForm.get("ArabicHeadOffice").setValue(data[0]["ArabicHeadOffice"]);

        this.systemPreferencesForm.get("TransCount").setValue(data[0]["TransCount"]);
        this.systemPreferencesForm.get("BeginYear").setValue(data[0]["BeginYear"]);
        this.systemPreferencesForm.get("VAT_No").setValue(data[0]["VAT_No"]);

        this.systemPreferencesForm.get("VAT_IN_ItemCode").setValue(data[0]["VAT_IN_ItemCode"]);
        this.systemPreferencesForm.get("VAT_ItemCode").setValue(data[0]["VAT_ItemCode"]);

        this.systemPreferencesForm.get("UseManufacturing").setValue(data[0]["UseManufacturing"]);
        this.systemPreferencesForm.get("LockCompletedSOF").setValue(data[0]["LockCompletedSOF"]);
        this.systemPreferencesForm.get("GLEntriesForMTN").setValue(data[0]["GLEntriesForMTN"]);
        this.systemPreferencesForm.get("UseSales").setValue(data[0]["UseSales"]);

        this.systemPreferencesForm.get("UsePurchs").setValue(data[0]["UsePurchs"]);
        this.systemPreferencesForm.get("UseStocks").setValue(data[0]["UseStocks"]);
        this.systemPreferencesForm.get("AutoCalcVAT").setValue(data[0]["AutoCalcVAT"]);
        this.systemPreferencesForm.get("PreventInvWithoutIssue").setValue(data[0]["PreventInvWithoutIssue"]);

        this.systemPreferencesForm.get("UseAccounts").setValue(data[0]["UseAccounts"]);
        this.systemPreferencesForm.get("UseBanks").setValue(data[0]["UseBanks"]);
        this.systemPreferencesForm.get("UseNotifications").setValue(data[0]["UseNotifications"]);
        this.systemPreferencesForm.get("VerifyItemAccounts").setValue(data[0]["VerifyItemAccounts"]);

        this.systemPreferencesForm.get("Logo").setValue(data[0]["Logo"]);
        this.systemPreferencesForm.get("Small_Logo").setValue(data[0]["Small_Logo"]);
        this.systemPreferencesForm.get("WaterMark").setValue(data[0]["WaterMark"]);

        // get images
        this.logo = data[0]["Logo"];
        this.smLogo = data[0]["Small_Logo"];
        this.waterMark = data[0]["WaterMark"];

        // get VAT data
        this.getVat();

        // close loader
        this.isLoading = false;
      },
      err => {
        // set notification
        let title = this.lang.genericErrMsgTitle;
        let message = this.lang.genericErrMsgDetails;
        let notification = 'error';
        let options = (this.getLang() == 'EN') ? {nzClass: 'lang-en'} : {nzClass: 'lang-ar'};

        this.notification.create(notification, title, message, options);
        // close loader
        this.isLoading = false;
      }
    )
  }

  // get image url

  getImageUrlForLogo(src) {
    let url: any;

    if (this.logo == null || this.logo == '') {
      url = './../../../../assets/images/no-image.png';
      return url;
    }

    (src != "")
      ? url = this.sanitizer.bypassSecurityTrustUrl(src)
      : url = this.sanitizer.bypassSecurityTrustUrl(`data:image/*;base64,${this.logo}`);    

    return url;
  }

  getImageUrlForSmLogo(src) {
    let url: any;

    if (this.smLogo == null || this.smLogo == '') {
      url = './../../../../assets/images/no-image.png';
      return url;
    }

    (src != "")
      ? url = this.sanitizer.bypassSecurityTrustUrl(src)
      : url = this.sanitizer.bypassSecurityTrustUrl(`data:image/*;base64,${this.smLogo}`);    

    return url;
  }

  getImageUrlForWatermark(src) {
    let url: any;

    if (this.waterMark == null || this.waterMark == '') {
      url = './../../../../assets/images/no-image.png';
      return url;
    }

    (src != "")
      ? url = this.sanitizer.bypassSecurityTrustUrl(src)
      : url = this.sanitizer.bypassSecurityTrustUrl(`data:image/*;base64,${this.waterMark}`);    

    return url;
  }

  // image change
  imageChangeLogo(src) {
    const file = src.files[0];
    const reder = new FileReader();

    reder.addEventListener("load", (e: any)  => {
      this.uploadedLogo = e.target.result;
      this.logo = this.sanitizer.bypassSecurityTrustUrl(`data:image/*;base64, ${this.logo}`); 
    });

    reder.readAsDataURL(file);
  }

  imageChangeSmLogo(src) {
    const file = src.files[0];
    const reder = new FileReader();

    reder.addEventListener("load", (e: any)  => {
      this.uploadedSmLogo = e.target.result;
      this.smLogo = this.sanitizer.bypassSecurityTrustUrl(`data:image/*;base64,${this.smLogo}`); 
    });
    
    reder.readAsDataURL(file);
  }

  imageChangeWatermark(src) {
    const file = src.files[0];
    const reder = new FileReader();

    reder.addEventListener("load", (e: any)  => {
      this.uploadedWatermark = e.target.result;
      this.waterMark = this.sanitizer.bypassSecurityTrustUrl(`data:image/*;base64,${this.waterMark}`); 
    });
    
    reder.readAsDataURL(file);
  }

  //#endregion

  // check language
  getLang() {
    return localStorage.getItem('lang');
  }

  // convert form data into array
  // Mohammed Hamouda - 02/02/2021

  extractDataAsArray(data) {
    let arrOfKeys = Object.keys(data);
    let arrOfData = [];

    for (let i = 0; i <= arrOfKeys.length - 1; i ++) {

      if (typeof(data[arrOfKeys[i]]) == 'boolean') {
        arrOfData.push([arrOfKeys[i], (data[arrOfKeys[i]]) ? 1 : 0]);
      } else {
        if (arrOfKeys[i] == "Logo") {
          let imgSrc = $('#js_logo').attr('src');
          let imgSrcIndex = imgSrc.indexOf(',');
          imgSrcIndex++
          arrOfData.push([arrOfKeys[i], imgSrc.slice(imgSrcIndex, imgSrc.length)]);
        } else if (arrOfKeys[i] == "Small_Logo") {
          let imgSrc = $('#js_small_logo').attr('src');
          let imgSrcIndex = imgSrc.indexOf(',');
          imgSrcIndex++
          arrOfData.push([arrOfKeys[i], imgSrc.slice(imgSrcIndex, imgSrc.length)]);
        } else if (arrOfKeys[i] == "WaterMark") {
          let imgSrc = $('#js_watermark').attr('src');
          let imgSrcIndex = imgSrc.indexOf(',');
          imgSrcIndex++
          arrOfData.push([arrOfKeys[i], imgSrc.slice(imgSrcIndex, imgSrc.length)]);
        }

        arrOfData.push([arrOfKeys[i], data[arrOfKeys[i]]])
      }      
    }

    return arrOfData;
  }

  // update preferences
  // Mohammed Hamouda - 02/02/2021

  updatePreferences() {
    const preferences = this.extractDataAsArray(this.systemPreferencesForm.value);

    let title;
    let message;
    let notification;
    let options = (this.getLang() == 'EN') ? {nzClass: 'lang-en'} : {nzClass: 'lang-ar'};

    this.isUpdating = true;
    
    this.service.saveRecord(preferences, 'SYSTEM', 'Edit', localStorage.getItem('username'), "", "", "", "", "", "", "", "", "").subscribe(
      res => {
        title = this.lang.systemPreferencesMsgTitle;
        message = this.lang.systemPreferencesMsgDetails;
        notification = 'success';

        this.notification.create(notification, title, message, options);

        this.isUpdating = false;

        this.updateLocalSystemVariables();
      },
      err => {
        title = this.lang.systemPreferencesMsgTitle;
        message = (this.getLang() == "EN") ? err.error.latin : err.error.arabic;
        notification = 'error';
        this.notification.create(notification, title, message, options);

        this.isUpdating = false;
      }
    )
  }

  // update preferences at local storage
  // Mohammed Hamouda - 25/02/2021

  updateLocalSystemVariables() {
    this.system[0].AutoCalcVAT = this.systemPreferencesForm.get('AutoCalcVAT').value;
    this.system[0].BeginYear = this.systemPreferencesForm.get('BeginYear').value;
    this.system[0].GLEntriesForMTN = this.systemPreferencesForm.get('GLEntriesForMTN').value;
    this.system[0].PreventInvWithoutIssue = this.systemPreferencesForm.get('PreventInvWithoutIssue').value;
    this.system[0].TransCount = this.systemPreferencesForm.get('TransCount').value;
    this.system[0].UseAccounts = this.systemPreferencesForm.get('UseAccounts').value;
    this.system[0].UseBanks = this.systemPreferencesForm.get('UseBanks').value;
    this.system[0].UseManufacturing = this.systemPreferencesForm.get('UseManufacturing').value;
    this.system[0].UseNotifications = this.systemPreferencesForm.get('UseNotifications').value;
    this.system[0].UsePurchs = this.systemPreferencesForm.get('UsePurchs').value;
    this.system[0].UseSales = this.systemPreferencesForm.get('UseSales').value;
    this.system[0].UseStocks = this.systemPreferencesForm.get('UseStocks').value;
    this.system[0].VerifyItemAccounts = this.systemPreferencesForm.get('VerifyItemAccounts').value;

    localStorage.setItem('systemVariables', JSON.stringify(this.system));
  }

  // get VAT  
  // Mohammed Hamouda - 03/02/2021

  getVat() {
    this.service.getVAT().subscribe(
      res => {
        let data: any = res;
        this.data = JSON.parse(data);
      }
    )
  }

  // show popup

  showPopUp(type) {
    (type == 'vatInput') ? this.VATType = 'Vat Item Code(INPUT)' : this.VATType = 'Vat Item Code(OUTPUT)';
    this.isVisible = true;
  }

  // set VAT for input or output
  onItemClicked(index) {
    let selectedVAT: any = this.data[index];
    (this.VATType == 'Vat Item Code(INPUT)') 
      ? this.systemPreferencesForm.get('VAT_IN_ItemCode').setValue(selectedVAT.ItemCode) 
      : this.systemPreferencesForm.get('VAT_ItemCode').setValue(selectedVAT.ItemCode);
    
    this.isVisible = false;
  }

  // close popup
  handleCancel() {
    this.isVisible = false;
  }

}
