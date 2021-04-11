import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FrmService } from 'src/services/frm/frm.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as lang from './../../../../settings/lang';
import { DatabindingService } from 'src/services/databinding.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePwpForm: FormGroup;

  isChanging: boolean = false;

  lang: any;

  constructor (
    private fb: FormBuilder, 
    private service: FrmService, 
    private notification: NzNotificationService,
    private binding: DatabindingService) { }

  ngOnInit() {
    // init form
    this.changePwpForm = this.fb.group({
      oldPwp: [""],
      newPwp: ["", Validators.required],
      verifyPwp: ["", [Validators.required, this.confirmationValidator]],
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
  }

  // check language
  getLang() {
    return localStorage.getItem('lang');
  }

  //#region 

  // dealing with password confirmation
  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.changePwpForm.controls.verifyPwp.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.changePwpForm.controls.newPwp.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  //#endregion

  // change pwp

  changePwp(){
    const {oldPwp, newPwp, verifyPwp} = this.changePwpForm.value;

    let title;
    let message;
    let notification;
    let options = (this.getLang() == 'EN') ? {nzClass: 'lang-en'} : {nzClass: 'lang-ar'};

    this.isChanging = true;

    this.service.changePassword(newPwp, localStorage.getItem('username'), oldPwp).subscribe(
      res => { // display notification to the user according to the status
        if (res) {
          title = this.lang.changePwpMsgTitle
          message = this.lang.changePwpMsgDetails;
          notification = 'success';

          this.notification.create(notification, title, message, options);

          this.changePwpForm.reset();
        } else {
          title = this.lang.changePwpMsgTitle
          message = this.lang.changePwpMsgFail;
          notification = 'error';

          this.notification.create(notification, title, message, options);
        }

        this.isChanging = false;
      }, 
      err => {
        title = this.lang.genericErrMsgTitle
        message = this.lang.genericErrMsgDetails;
        notification = 'error';

        this.notification.create(notification, title, message, options);

        this.isChanging = false;
      }
    )
  }

}
