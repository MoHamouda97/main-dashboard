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

  // Mohammed Hamouda
  items = [];
  lang: any;
  menueItems: any = [];
  @ViewChild('value', {static: true}) comboValue: ElementRef;

  constructor(
    private modalService: NgbModal, 
    private binding: DatabindingService,
    private route: Router,
    private notification: NzNotificationService) {}
  // This is for Notifications
  notifications: Object[] = [
    {
      btn: 'btn-danger',
      icon: 'ti-link',
      title: 'Luanch Admin',
      subject: 'Just see the my new admin!',
      time: '9:30 AM'
    },
    {
      btn: 'btn-success',
      icon: 'ti-calendar',
      title: 'Event today',
      subject: 'Just a reminder that you have event',
      time: '9:10 AM'
    },
    {
      btn: 'btn-info',
      icon: 'ti-settings',
      title: 'Settings',
      subject: 'You can customize this template as you want',
      time: '9:08 AM'
    },
    {
      btn: 'btn-primary',
      icon: 'ti-user',
      title: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];

  // This is for Mymessages
  mymessages: Object[] = [
    {
      useravatar: 'assets/images/users/1.jpg',
      status: 'online',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:30 AM'
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'busy',
      from: 'Sonu Nigam',
      subject: 'I have sung a song! See you at',
      time: '9:10 AM'
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'away',
      from: 'Arijit Sinh',
      subject: 'I am a singer!',
      time: '9:08 AM'
    },
    {
      useravatar: 'assets/images/users/4.jpg',
      status: 'offline',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];

  ngAfterViewInit() {}

  ngOnInit() {
    setTimeout(() => {this.menueItems = JSON.parse(localStorage.getItem('menuForSearch'));}, 10)    
    console.log(this.menueItems)
  }

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
