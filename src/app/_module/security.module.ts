import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// system security
import { ChangePasswordComponent } from '../custom/security/change-password/change-password.component';
import { NotificationsComponent } from '../custom/security/notifications/notifications.component';
import { PostingComponent } from '../custom/security/posting/posting.component';
import { PreferencesComponent } from '../custom/security/preferences/preferences.component';

// ant
import { AntModule } from './ant.module';
// mat
import { MatModule } from './mat.module';
// pipes
import { PipesModule } from './pipes.module';
// shared modules and pieps
import { SharedModule } from './shared.module';
// reusable modules
import { ReusableModule } from './reusable.module';


@NgModule({
  declarations: [
    ChangePasswordComponent,
    PreferencesComponent,
    PostingComponent,
    NotificationsComponent,    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // ant module
    AntModule,
    // mat
    MatModule,
    // pipes
    PipesModule,
    // shared
    SharedModule, 
    // reusable
    ReusableModule,     
  ],
  exports: [
    ChangePasswordComponent,
    PreferencesComponent,
    PostingComponent,
    NotificationsComponent,
  ]
})
export class SecurityModule { }
