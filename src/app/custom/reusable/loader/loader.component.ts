import { Component, OnInit, Input, NgModule} from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})

export class LoaderComponent implements OnInit {
  @Input('loader') loader;
  constructor() { }

  ngOnInit() {
  }

}
