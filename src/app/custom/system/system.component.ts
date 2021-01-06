import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css']
})
export class SystemComponent implements OnInit {
  subscription: Subscription
  frmType;
  objID;
  isCostCenter = true;

  constructor(private router: ActivatedRoute, private chRef: ChangeDetectorRef) { }

  ngOnInit() {
    //#region 
      // get frm type from route 
      // Mohammed Hamouda - 30/12/2020 => v1 
      // Mohammed Hamouda - 4/1/2021 => v2 get object id from route
      this.subscription = this.router.paramMap.subscribe(
        res => {
          this.isCostCenter = false;
          this.chRef.detectChanges();
          this.isCostCenter = true;
          
          this.frmType = res.get('frmType');
          this.objID = res.get('id');

          localStorage.setItem('frmName', this.frmType);
          localStorage.setItem('objID', this.objID);
        }
      )
    //#endregion
  }

  ngOnDestroy() {
    //#region 
      // cancel subscription
      // Mohammed Hamouda - 30/12/2020
      this.subscription.unsubscribe();
    //#endregion
  }

}
