import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as lang from './../../settings/lang';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  lang: any;

  constructor(private router: Router, private notification: NzNotificationService) { }

  canActivate(route, state: RouterStateSnapshot) {
    (this.getLang() == 'EN') ? this.lang = lang.en : this.lang = lang.ar;

    let title = this.lang.authWarningMsgTitle;
    let message = this.lang.authWarningMsgDetails;
    let options = (this.getLang() == 'EN') ? {nzClass: 'lang-en'} : {nzClass: 'lang-ar'};
    
    if(localStorage.getItem('username'))
      return true;
        
    this.notification.warning(title, message, options);

    this.router.navigate(['/authentication/login'], {queryParams: {returnUrl: state.url}});
    
    return false;
  }

  getLang() {
    return localStorage.getItem('lang');
  }
}
