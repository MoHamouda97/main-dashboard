import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NotfoundComponent } from './404/not-found.component';
import { LockComponent } from './lock/lock.component';
import { LoginComponent } from './login/login.component';
import { Login2Component } from './login2/login2.component';
import { SignupComponent } from './signup/signup.component';
import { Signup2Component } from './signup2/signup2.component';

import { AuthenticationRoutes } from './authentication.routing';

// mat design
import {MatRippleModule} from '@angular/material/core';

// ant
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageModule } from 'ng-zorro-antd/message';

// pipes
import { TranslateEnPipe } from './../../pipes/translateEn.pipe';
import { TranslateArPipe } from './../../pipes/translateAr.pipe';

//reusable
import { LoaderComponent } from '../custom/reusable/loader/loader.component';
import { SystemModule } from '../custom/system/system.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(AuthenticationRoutes),
    NgbModule,
    // mat
    MatRippleModule,
    // ant
    NzSelectModule,
    NzInputModule,
    NzFormModule,
    NzNotificationModule,
    NzIconModule,
    NzMessageModule,
    SystemModule,
  ],
  declarations: [
    NotfoundComponent,
    LoginComponent,
    SignupComponent,
    LockComponent,
    Login2Component,
    Signup2Component,
  ],
})
export class AuthenticationModule {}
