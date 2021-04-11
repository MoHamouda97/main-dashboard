import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FrmService } from 'src/services/frm/frm.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as $ from 'jquery';
import * as lang from './../../../../settings/lang';
import { DatabindingService } from 'src/services/databinding.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  // events data
  data: any = [];
  original: any = [];
  tblData: any = [];
  availableUsers: any = [];
  selectedUsers: any = [];

  // language
  lang: any; 

  // loading
  isLoading = true;
  isNewData = true;

  // save index of selected event
  index

  constructor (
    private service: FrmService, 
    private notification: NzNotificationService,
    private binding: DatabindingService,
    private chdf: ChangeDetectorRef) { }

    list: any = [];

  ngOnInit() {
    this.getEvents();

    // responding to language change
    this.binding.checkIsLangChanged.subscribe(
      res => {
        if (res != null) {
          this.lang = (res == 'EN') ? lang.en : lang.ar;
        }              
      }
    );

    this.lang = (localStorage.getItem('lang') == 'EN') ? lang.en : lang.ar;   

  }

  change(ret: {}): void {
    let selection: any = ret;
    (selection.to == 'right') ? this.addToEvent(selection.list) : this.removeFromEvent(selection.list);
  }  

  //#region 

  // get events
  // Mohammed Hamouda - 04/02/2021

  getEvents() {

    this.service.getEvents().subscribe(
      res => {
        let data: any = res;
        this.data = JSON.parse(data);
        this.original = this.data;
        
        this.isLoading = false;
      },
      err => {
        this.showNotification('error', this.lang.genericErrMsgTitle, this.lang.genericErrMsgDetails);
        this.isLoading = false;
      }
    )
  }

  
  // this function is used to recive data from table pagination
  tblPageChangeHandler(data){
    this.tblData = data;
  }

  // check when user click a row  

  onItemClicked(index) {
    let selectedEvent = this.tblData[index];

    this.index = index;
    
    // highlight selected rep
    $('body').on("click", '.event', function() {
      $(this).addClass('highlight').siblings().removeClass('highlight')
    });

    this.getAvailableUsersAtEvent(selectedEvent.EventID);
  }  

  filterData(key, val) { // search
    (val == '') 
      ? this.data = this.original
      : this.data = this.data.filter(d => d[key].toString().toLocaleLowerCase().trim().includes(val.toString().toLocaleLowerCase().trim()));
  } 
  
  // reset function when no data on the search

  reset() {
    this.data = this.original;
  }

  // get available user at event

  getAvailableUsersAtEvent(id) {
    this.isLoading = true;
    this.isNewData = false;

    this.list = [];

    this.service.getAvailableUsersAtEvent(id).subscribe(
      res => {
        let data: any = res;

        this.availableUsers = JSON.parse(data);

        this.service.getSelectedUsersAtEvent(id).subscribe(
          res => {
            let data: any = res;
            this.selectedUsers = JSON.parse(data);

            for (let i = 0; i <= this.availableUsers.length - 1; i++) {
              this.list.push({
                key: i.toString(),
                title: `${this.availableUsers[i].UserName} - ${this.availableUsers[i].EMail}`,
                username: this.availableUsers[i].UserName,
                direction: 'left'
              })
            }

            for (let i = 0; i <= this.selectedUsers.length - 1; i++) {
              this.list.push({
                key: i.toString(),
                title: `${this.selectedUsers[i].UserName} - ${this.selectedUsers[i].EMail}`,
                username: this.selectedUsers[i].UserName,
                direction: 'right'
              })
            }

            this.chdf.detectChanges();
            this.isNewData = true;

            this.isLoading = false;
          },
          err => {
            this.showNotification('error', this.lang.genericErrMsgTitle, this.lang.genericErrMsgDetails);
            this.isLoading = false;
          }
        )
        
      },
      err => {
        this.showNotification('error', this.lang.genericErrMsgTitle, this.lang.genericErrMsgDetails);
        this.isLoading = false;
      }
    )
  }

  // add user to an event or delete user from event
  // Mohammed Hamouda 07/02/2021

  async addToEvent(user) {
    this.isLoading = true;

    for (let i = 0; i <= user.length - 1; i++) {
      let sql = `INSERT INTO EventsDtl (EventID, UserName) VALUES ('${this.tblData[this.index].EventID}', '${user[i].username}')`;
      let result = await this.service.execQueryAsPromise(sql).then(() => {
        if (i == user.length -1) {
          this.showNotification('success', this.lang.addUserEventMsgTitle, this.lang.addUserEventMsgMsg);
          this.isLoading = false;
        }
      }).catch(() => {
        this.showNotification('error', this.lang.genericErrMsgTitle, this.lang.genericErrMsgDetails);
        this.isLoading = false;
      })

    }
  }

  async removeFromEvent(user) {
    this.isLoading = true;
    const promises = [];

    for (let i = 0; i <= user.length - 1; i++) {
      let sql = `DELETE FROM EventsDtl WHERE (EventID = '${this.tblData[this.index].EventID}' AND UserName = '${user[i].username}')`;
      let result = await this.service.execQueryAsPromise(sql).then(() => {
        if (i == user.length -1) {
          this.showNotification('success', this.lang.removeUserEventMsgTitle, this.lang.removeUserEventMsgMsg);
          this.isLoading = false;
        }
      }).catch(() => {
        this.showNotification('error', this.lang.genericErrMsgTitle, this.lang.genericErrMsgDetails);
        this.isLoading = false;
      })
    }
  }


  //#endregion

  // check language
  getLang() {
    return localStorage.getItem('lang');
  }

  // notification

  showNotification(type, title, message) {
    let options = (this.getLang() == 'EN') ? {nzClass: 'lang-en'} : {nzClass: 'lang-ar'};
    this.notification.create(type, title, message, options);
  } 
  
  // return list titles

  listTitles() {
    if (this.getLang() == 'EN')
      return ['Available Users', 'Selected Users']

    return ['المستخدمون المتاحون', 'المستخدمون المحددون']
  }

}
