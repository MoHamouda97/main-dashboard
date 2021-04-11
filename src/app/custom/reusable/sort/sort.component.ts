import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.css']
})
export class SortComponent implements OnInit, OnChanges {
  @Input('data') data;
  @Input('sortIndex') sortIndex = 0;
  @Input('title') title;
  @Output('sortedData') sortedData : EventEmitter<any> = new EventEmitter();

  isSortAsc: boolean = true;
  constructor() { }

  ngOnInit() {
  }

  sortBy() {
    const data = this.data.slice();
    const field: any = Object.keys(this.data[0]);

    this.data = data.sort((a, b) => {      
      return this.compare(a[field[this.sortIndex]], b[field[this.sortIndex]], this.isSortAsc);
    });

    this.sortedData.emit(this.data);

    this.isSortAsc = !this.isSortAsc;
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }  

  ngOnChanges(changes: SimpleChanges) {
    // get data to be sorted    
    const isData = setInterval(() => {
      if (typeof (changes.data) == 'undefined') {
        null;
      } else {
        this.data = changes.data.currentValue;
        clearInterval(isData);
      }
    }, 100);        

    // get sort index
    const isIndex = setInterval(() => {
      if (typeof (changes.sortIndex) == 'undefined') {
        null;
      } else {
        this.sortIndex = changes.sortIndex.currentValue;
        clearInterval(isIndex);
      }
    }, 100);    
  }

}
