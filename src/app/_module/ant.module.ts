import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ant modules
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { MatRippleModule } from '@angular/material';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { NzRadioModule } from 'ng-zorro-antd/radio';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NzMessageModule, 
    NzAlertModule,
    NzIconModule,
    NzFormModule,
    NzInputModule,  
    NzCheckboxModule,  
    NzSelectModule,
    NzNotificationModule,
    NzModalModule,
    NzTableModule,
    MatRippleModule,
    NzToolTipModule,
    NzDropDownModule,
    NzAutocompleteModule,
    NzDatePickerModule,
    NzDescriptionsModule,
    NzTransferModule,
    NzRadioModule,
    NzSwitchModule      
  ],
  exports: [
    NzMessageModule, 
    NzAlertModule,
    NzIconModule,
    NzFormModule,
    NzInputModule,  
    NzCheckboxModule,  
    NzSelectModule,
    NzNotificationModule,
    NzModalModule,
    NzTableModule,
    MatRippleModule,
    NzToolTipModule,
    NzDropDownModule,
    NzAutocompleteModule,
    NzDatePickerModule,
    NzDescriptionsModule,
    NzTransferModule,
    NzRadioModule,
    NzSwitchModule 
  ]
})
export class AntModule { }
