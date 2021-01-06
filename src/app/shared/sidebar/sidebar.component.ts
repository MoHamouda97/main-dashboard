import { Component, AfterViewInit, OnInit } from '@angular/core';
import { ROUTES } from './menu-items';
import { RouteInfo } from './sidebar.metadata';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuService } from 'src/services/menu/menu.service';
import * as lang from './../../../settings/lang';
import { DatabindingService } from 'src/services/databinding.service';
declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  showMenu = '';
  showSubMenu = '';
  dbRoutes: any[] = []
  public sidebarnavItems: any[];  
  menuItems;
  reportItems;
  icons = ['mdi mdi-dots-horizontal', 'mdi mdi-book-open-variant', 'mdi mdi-bank', 'fas fa-dollar-sign', 'mdi mdi-store', 'fab fa-cc-visa', 'mdi mdi-trending-up', 'mdi mdi-security', 'fas fa-cog', ' fas fa-database'];
  lang;
  arrForSQL = [];
  
  // this is for the open close
  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }
  addActiveClass(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = '0';
    } else {
      this.showSubMenu = element;
    }
  }

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private menuService: MenuService,
    private binding: DatabindingService
  ) {}

  // End open close
  ngOnInit() {
    //this.sidebarnavItems = ROUTES.filter(sidebarnavItem => sidebarnavItem);    
    this.get('f', 'admin', 'J', localStorage.getItem('lang'), 'r');

//#region     

    // handle translation
    // Mohammed Hamouda - 29/12/2020 => v1 (detect language changing)

    this.binding.checkIsLangChanged.subscribe(
      res => {
        if (res != null) {
          this.get('f', 'admin', 'J', res, 'r');
          this.lang = (res == 'EN') ? lang.en : lang.ar;
        }
      }
    );
    
    this.lang = (localStorage.getItem('lang') == 'EN') ? lang.en : lang.ar;

//#endregion    
  }


//#region 

  // Get menu items from the DB
  // Mohammed Hamouda - 28/12/2020 => v1 (Get menu items from db & add icons for each item)
  // Mohammed Hamouda - 29/12/2020 => v2 (Get report items from db & add icons for each item & add rendering functions)
  // Mohammed Hamouda - 30/12/2020 => v3 (extract SQL statement from the bd)

  get(type, username, BranchCode, lang, typeRpt) {
    this.menuService.get(type, username, BranchCode, lang).subscribe(
      res => {
        this.menuItems = res;
        this.getRptItems(typeRpt, username, BranchCode, lang);
      }
    )
  }

  // get report items

  getRptItems(type, username, BranchCode, lang) {
    this.menuService.get(type, username, BranchCode, lang).subscribe(
      res => {
        this.reportItems = res;
        this.renderMenuItems(this.menuItems);
        this.adjustIcons(); 
        this.renderReportItems(this.reportItems);
      }
    ) 
  }

  // adjust icons

  adjustIcons() {
    return this.dbRoutes.map((val, index) => {this.dbRoutes[index].icon = this.icons[index]});
  }

  // render menu items

  renderMenuItems(items: any[]) {
    this.dbRoutes = items.map((val, index) => {
      return {
        path: '',
        title: items[index].root,
        icon: 'mdi mdi-book-open-variant',
        class: 'has-arrow', 
        extralink: false,
        submenu: items[index].subrootlist.map((val, index2) => {
          return {
            path: `/system/${items[index].subrootlist[index2].ObjectName}/${items[index].subrootlist[index2].ID}`,
            title: items[index].subrootlist[index2].ObjectTitle,
            icon: '',
            class: '',
            extralink: false,
            submenu: []                 
          }
        })          
      }
    });

    this.dbRoutes.unshift(
      {
        path: '',
        title: `${this.lang.menuItems}`,
        icon: 'mdi mdi-dots-horizontal',
        class: 'nav-small-cap',
        extralink: true,
        submenu: []
      }      
    );

    this.extractSQL(items);
  }

  // extract SQL statement from the bd

  extractSQL(items) {
    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < items[i].subrootlist.length; j++) {
        this.arrForSQL.push({
          objName: items[i].subrootlist[j].ObjectName,
          SQL: items[i].subrootlist[j].SqlStatment
        })
      }
    }

    localStorage.setItem('SQL', JSON.stringify(this.arrForSQL));
  }

  // render menu items

  renderReportItems(items: any[]) {
    let rptItems = items.map((val, index) => {
      return {
        path: '',
        title: items[index].root,
        icon: 'fas fa-file-alt',
        class: 'has-arrow', 
        extralink: false,
        submenu: items[index].subrootlist.map((val, index2) => {
          return {
            path: `/system/${items[index].subrootlist[index2].ObjectName}`,
            title: items[index].subrootlist[index2].ObjectTitle,
            icon: '',
            class: '',
            extralink: false,
            submenu: []                 
          }
        })          
      }
    });
    
    rptItems.unshift(
      {
        path: '',
        title: `${this.lang.rptItems}`,
        icon: 'mdi mdi-dots-horizontal',
        class: 'nav-small-cap',
        extralink: true,
        submenu: []
      }      
    );

    for (let i = 0; i < rptItems.length; i++) 
      this.dbRoutes.push(rptItems[i])
    
    this.sidebarnavItems = this.dbRoutes.filter(sidebarnavItem => sidebarnavItem);  
  }  

//#endregion

}
