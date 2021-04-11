import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { FrmService } from 'src/services/frm/frm.service';
import * as $ from 'jquery';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    private sub: any;

    constructor(private slimLoader: SlimLoadingBarService, private router: Router, private service: FrmService) {
        // Listen the navigation events to start or complete the slim bar loading
        this.sub = this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.slimLoader.start();
            } else if (event instanceof NavigationEnd ||
                event instanceof NavigationCancel ||
                event instanceof NavigationError) {
                this.slimLoader.complete();
            }
        }, (error: any) => {
            this.slimLoader.complete();
        });
    }

    ngOnInit(): any {
        // set defualt language
        // Mohammed Hamouda - 28/12/2020
        (localStorage.getItem("lang")) ? null : localStorage.setItem("lang", "EN");

        // get dictionary
        // Mohammed Hamouda - 3/1/2020        
        this.service.GetDichttp().subscribe(
            res => {
                let dictionary: any = res;
                localStorage.removeItem('dictionary');
                localStorage.setItem("dictionary", dictionary);
                console.log(localStorage.getItem('dictionary'))
            }
        )
    }

    ngOnDestroy(): any {
        this.sub.unsubscribe();
    }
}
