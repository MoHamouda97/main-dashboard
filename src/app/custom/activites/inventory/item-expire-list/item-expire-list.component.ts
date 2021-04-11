import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-expire-list',
  templateUrl: './item-expire-list.component.html',
  styleUrls: ['./item-expire-list.component.css']
})
export class ItemExpireListComponent implements OnInit {
  // data
  data: any[] = [];
  
  constructor() { }

  ngOnInit() {
  }

}
