import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FrmService } from 'src/services/frm/frm.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as lang from './../../../settings/lang';
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  loginform = true;
  recoverform = false;
  isLoading: boolean = true;
  isSignIn: boolean = false;

  lang: any;

  branches: any = [
    {code: "J", name: "Jeddah"}
  ];

  constructor (
    private fb: FormBuilder, 
    private service: FrmService, 
    private notification: NzNotificationService, 
    private router: Router,
    private message: NzMessageService) { }

  ngOnInit() {

    this.loginForm = this.fb.group({
      username: ["", Validators.required],
      branchCode: ["J", Validators.required],
      pwp: [""],
    });

    (this.getLang() == "EN") ? this.lang = lang.en : this.lang = lang.ar;

    this.getBranches();
  }

  showRecoverForm() {
    this.loginform = !this.loginform;
    this.recoverform = !this.recoverform;
  }

  //#region 

    // check lang

    getLang() {
      return localStorage.getItem('lang');
    }

  //#endregion


  //#region 

    // get branches
    // Mohammed Hamouda - 27/01/2021

    getBranches() {
      this.service.getbranches().subscribe(
        res => {
          this.branches = res;
          this.isLoading = false;
        }
      )
    }

  //#endregion

  //#region 

    // login
    // Mohammed Hamouda - 27/01/2021

    login() {
      const {username, branchCode, pwp} = this.loginForm.value;
      
      let title;
      let message;
      let notification;
      let welcomeMessage;
      let options = (this.getLang() == 'EN') ? {nzClass: 'lang-en'} : {nzClass: 'lang-ar'};

      this.isSignIn = true;

      this.service.userAuth(username, branchCode, pwp).subscribe(
        res => {
          if (res) {
            // get system variables
            this.service.loadSystemVariables(username, branchCode).subscribe(
              res => {
                // save required data in local storage
                localStorage.setItem('username', username);
                localStorage.setItem('branchCode', branchCode);
                localStorage.setItem('systemVariables', JSON.stringify(res));
                
                // set class for ant message to control dir according to language
                (this.getLang() == 'AR') ? $('.ant-message').addClass('ant-message-ar') : null;

                // set value for message vars & call the notification method
                title = `${this.lang.authWelcomeMsg} ${username}`
                message = this.lang.authWelcomeMsgDetails;
                notification = 'success';
                welcomeMessage = `${this.lang.authWelcomeMsg} ${username}`;                
                
                this.notification.create(notification, title, message, options);

                // redirect user to home page
                setTimeout(() => {/*this.router.navigate(['/']);*/ location.href = '/'}, 100);

                // stop button loading
                this.isSignIn = false;
              },
              err => {
                title = this.lang.genericErrMsgTitle;
                message = this.lang.genericErrMsgDetails;
                notification = 'error';
      
                this.notification.create(notification, title, message, options);
      
                this.isSignIn = false;
              }
            )


            
          } else {
            title = this.lang.authErrorMsgTitle;
            message = this.lang.authErrorMsgDetails;
            notification = 'error';

            this.notification.create(notification, title, message, options);

            this.isSignIn = false;
          }          
        },
        err => {
          title = this.lang.genericErrMsgTitle;
          message = this.lang.genericErrMsgDetails;
          notification = 'error';

          this.notification.create(notification, title, message, options);

          this.isSignIn = false;
        }
      )
    }

  //#endregion
}
