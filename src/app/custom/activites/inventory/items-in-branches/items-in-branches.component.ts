import {Component, OnInit, ViewChild } from '@angular/core';
import { FrmService } from 'src/services/frm/frm.service';

@Component({
  selector: 'app-items-in-branches',
  templateUrl: './items-in-branches.component.html',
  styleUrls: ['./items-in-branches.component.css']
})
export class ItemsInBranchesComponent implements OnInit {
  data: any = [];
  original: any = [];
  tblData: any = [];
  selectedRow: any[] = [];
  keys: any[] = [];

  modalTitle: string = '';

  isTableSearch: boolean = true;
  isVisible: boolean = false;

  constructor(private service: FrmService) { }

  ngOnInit() {
    this.loadForm();
  }

  loadForm() {
    this.service.loadForm().subscribe(
      res => {
        let data: any = res;
        this.data = JSON.parse(data);
        this.original = JSON.parse(data);
        console.log(this.data)
        this.isTableSearch = false;
      }
    )
  }

  //#region 

    // check lang

    getLang() {
      return localStorage.getItem('lang');
    }  

  //#endregion

  //#region 

  // tbl functions
  // Mohammed Hamouda 25/01/2021

  filterData(key, val) { // search

    (val == '') 
      ? this.data = this.original
      : this.data = this.data.filter(d => d[key].toLocaleLowerCase().trim().includes(val.toLocaleLowerCase().trim()));
  }

  tblPageChangeHandler(data) { //recive data from table pagination
    this.tblData = data;
  }

  onItemClicked(index) { // when user click a row
    this.selectedRow.push(this.tblData[index]);
    this.keys = Object.keys(this.tblData[index]);

    this.modalTitle = this.selectedRow[0].ItemName;

    const removableIndex = this.keys.findIndex(k => k == "ItemName");
    this.keys.splice(removableIndex, 1);

    this.isVisible = true;
  }

  //#endregion

  //#region 

  handleCancel() { // close the modal
    this.selectedRow = [];
    this.keys = [];

    this.isVisible = false;
  }

  //#endregion

}
