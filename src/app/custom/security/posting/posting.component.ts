import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FrmService } from 'src/services/frm/frm.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as lang from './../../../../settings/lang';
import { DatabindingService } from 'src/services/databinding.service';

@Component({
  selector: 'app-posting',
  templateUrl: './posting.component.html',
  styleUrls: ['./posting.component.css']
})
export class PostingComponent implements OnInit, OnChanges {
  // check screen type is posting or not
  @Input('isPosting') isPosting; 

  // form
  postingForm: FormGroup;

  // accounts
  accounts: any = [
    {name: "Sales", controlName: "Sales"},
    {name: "Purchases-Bills", controlName: "Purchases_Bills"},
    {name: "Stock", controlName: "Stock"},
    {name: "Receivables", controlName: "Receivables"},
    {name: "Payables", controlName: "Payables"},
    {name: "GL", controlName: "GL"}
  ];

  // language
  lang: any; 
  
  // loader var
  isLoading: boolean = true;

  // save data
  data: any = [];

  // for posting operations
  date: any;
  arrOfCheckedValue = [0, 0, 0, 0, 0, 0]
  isPostingOrUnPosting = false;
  isDesabled = false;

  constructor (
    private fb: FormBuilder, 
    private service: FrmService, 
    private notification: NzNotificationService,
    private binding: DatabindingService) { }

  ngOnInit() {
    // init form
    this.postingForm = this.fb.group({
      Sales: [false],
      Purchases_Bills: [false],
      Stock: [false],
      Receivables: [false],
      Payables: [false],
      GL: [false]
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

    // load data
    this.postUpostFormLoad();
  }

  // check language
  getLang() {
    return localStorage.getItem('lang');
  }

  // get posting data
  postUpostFormLoad() {
    this.service.postUpostFormLoad().subscribe(
      res => {
        let data: any = res;
        this.data = JSON.parse(data);

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

  // do posting or unposting

  doPostingOrUnposting() {
    let date = this.formatDate(this.date);
    (typeof(this.date) == 'undefined') 
      ? this.showNotification('warning', this.lang.emptyDateMsgTitle, this.lang.emptyDateMsgDetails)
      : this.callBackend(date);
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

  // notification

  showNotification(type, title, message) {
    let options = (this.getLang() == 'EN') ? {nzClass: 'lang-en'} : {nzClass: 'lang-ar'};
    this.notification.create(type, title, message, options);
  }

  // call backend for posting or unposting

  callBackend(date) {
    let keys = Object.keys(this.postingForm.value);
    let stringOfCheckedAccounts = '';

    for (let i = 0; i <= keys.length - 1; i++) {
      let index = keys.indexOf(keys[i]);

      (this.postingForm.get(keys[i]).value) 
        ? this.arrOfCheckedValue[index] = 1 
        : this.arrOfCheckedValue[index] = 0;      
      }

      stringOfCheckedAccounts = this.arrOfCheckedValue.join("");

      if (stringOfCheckedAccounts.includes("1")) {
        this.isPostingOrUnPosting = true;
        this.isDesabled = true;

        this.service.applayPostingOrUnposting(
          this.isPosting, 
          date, 
          stringOfCheckedAccounts, 
          localStorage.getItem('branchCode'), 
          localStorage.getItem('username')).subscribe(
          res => {

            if (typeof(res) == 'boolean') {
              (this.isPosting) 
              ? this.showNotification('success', this.lang.postingMsgTitle, `${this.lang.postingMsgDetails}`) 
              : this.showNotification('success', this.lang.unpostingMsgTitle, `${this.lang.unpostingMsgDetails}`)
            } else {
              (this.isPosting) 
              ? this.showNotification('warning', this.lang.postingMsgTitle, `${res}`) 
              : this.showNotification('warning', this.lang.unpostingMsgTitle, `${res}`)
            }

            this.isPostingOrUnPosting = false;
            this.isDesabled = false;

            this.arrOfCheckedValue = [0, 0, 0, 0, 0, 0];
          },
          err => {
            this.showNotification('error', this.lang.genericErrMsgTitle, this.lang.genericErrMsgDetails) 
            this.isPostingOrUnPosting = false;
            this.isDesabled = false;

            this.arrOfCheckedValue = [0, 0, 0, 0, 0, 0];
          }
        );       
      } else {
        this.showNotification('warning', this.lang.noSelectedAccountMsgTitle, this.lang.noSelectedAccountMsgDetails);
      }    
  }

  ngOnChanges(changes: SimpleChanges) {
    // check isPosting
    const isPosting = setInterval(() => {
      if (typeof (changes.isPosting) == 'undefined') {
        null;
      } else {
        this.isPosting = changes.isPosting.currentValue;
        this.postingForm.reset();
        this.date = undefined;
        this.arrOfCheckedValue = [0, 0, 0, 0, 0, 0];
        clearInterval(isPosting);
      }
    }, 100);
  }

}
