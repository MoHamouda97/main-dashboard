import { Component, AfterViewInit, EventEmitter, Output, ElementRef, ViewChild, OnInit } from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbPanelChangeEvent,
  NgbCarouselConfig
} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { DatabindingService } from 'src/services/databinding.service';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as lang from './../../../settings/lang';

//declare var $: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit, AfterViewInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  public config: PerfectScrollbarConfigInterface = {};

  public showSearch = false;

  // nav var
  items = [];
  lang: any;
  menueItems: any = [];
  username: string = '';
  branch: string = '';
  @ViewChild('value', {static: true}) comboValue: ElementRef;

  constructor(
    private modalService: NgbModal, 
    private binding: DatabindingService,
    private route: Router,
    private notification: NzNotificationService) {}

  ngAfterViewInit() {}

  ngOnInit() {
    this.getUsernameAndPassword();

    //#region 

      // dealing with page language

      this.binding.checkIsLangChanged.subscribe(
        res => {
          if (res != null) {
            this.lang = (res == 'EN') ? lang.en : lang.ar;
          }              
        }
      );

      this.lang = (localStorage.getItem('lang') == 'EN') ? lang.en : lang.ar;

    //#endregion    
  }

//#region 

  // get username & branch code
  // Mohammed Hamouda 

  getUsernameAndPassword() {
    const getUsernameAndPassword = setInterval(() => {
      if (localStorage.getItem('username')) {
        this.username = localStorage.getItem('username');
        this.branch = localStorage.getItem('branchCode');
        clearInterval(getUsernameAndPassword);
      }
    }, 10)
  }

//#endregion

//#region 

  // handle language
  // Mohammed Hamouda - 29/12/2020 => v1 (change direction and translate content)
  
  changeLang(option) {
    this.binding.changeLang(option); 
    localStorage.setItem('lang', option); 
  }

  getLang() {
    return localStorage.getItem('lang');
  }

//#endregion

//#region 

  // handle menu search
  // Mohammed Hamouda - 14/01/2021

  searchMenu(value) {
    this.menueItems = JSON.parse(localStorage.getItem('menuForSearch'));
    (value == '') 
      ? this.items = [] 
      : this.items = this.menueItems.filter(i => i.name.toLocaleLowerCase().trim().includes(value.toLocaleLowerCase().trim()));
  }

  clearSearch(name) {
    this.items = [];
    $('#js_search').val(name);
  }

  navigateByEnter(value){
    let item = this.menueItems.filter(i => i.name.toLocaleLowerCase().trim().includes(value.toLocaleLowerCase().trim()));
    this.route.navigate([`${item[0].path}`]);
    this.items = [];
  }

//#endregion

//#region

  // logout 
  // Mohammed Hamouda - 31/01/2021

  logout() {
    // save required data 
    const savedLang = localStorage.getItem('lang');
    const dictionary = localStorage.getItem('dictionary');

    // vars for displaying notifications
    (this.getLang() == 'EN') ? this.lang = lang.en : this.lang = lang.ar;

    const title = this.lang.signOutMsgTitle;
    const message = this.lang.signOutMsgDetails;
    const options = (this.getLang() == 'EN') ? {nzClass: 'lang-en'} : {nzClass: 'lang-ar'};    

    // clear local storage
    localStorage.clear();

    // add saved data
    localStorage.setItem('lang', savedLang);
    localStorage.setItem('dictionary', dictionary);

    // display notification
    this.notification.success(title, message, options);

    // direct user to login page
    setTimeout(() => {this.route.navigate(['/authentication/login']);}, 100)    
  }

//#endregion
}
