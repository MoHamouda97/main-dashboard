import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {
  // data from parent
  @Input('data') data = [];

  // send data to parent
  @Output('returnFormVal') returnFormVal : EventEmitter<any> = new EventEmitter();  
  
  // form var
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.contactFormGenerator();
    this.detectFormChange();
  }

  //#region 

    // check lang

    getLang() {
      return localStorage.getItem('lang');
    }  

  //#endregion 
  
  //#region // form generator

    // Mohammed Hamouda - 07/04/2021

    contactFormGenerator() {
      this.contactForm = this.fb.group({
        Address: [''],
        AltrFax: [''],
        AltrPhone: [''],
        AltrTelx: [''],
        Contact: [''],
        ContactTitle: [''],
        OthContact: [''],
        OthContactTitle: [''],
        Phone: [''],
        PoBox: [''],
        Telx: [''],
        E_Mail: [''],
        Fax: [''],
      });
    }

    detectFormChange() {
      this.contactForm.valueChanges.subscribe(
        result => this.returnFormVal.emit(result)
      )
    }    

  //#endregion

  //#region 

    // deal with length of data recived from search component
    // Mohammed Hamouda - 09/02/2021

    displayData(data: any) {
      this.contactForm.get('Address').setValue(data[0]['Address']);
      this.contactForm.get('AltrFax').setValue(data[0]['AltrFax']);
      this.contactForm.get('AltrPhone').setValue(data[0]['AltrPhone']);
      this.contactForm.get('AltrTelx').setValue(data[0]['AltrTelx']);
      this.contactForm.get('Contact').setValue(data[0]['Contact']);
      this.contactForm.get('ContactTitle').setValue(data[0]['ContactTitle']);
      this.contactForm.get('OthContact').setValue(data[0]['OthContact']);
      this.contactForm.get('OthContactTitle').setValue(data[0]['OthContactTitle']);
      this.contactForm.get('Phone').setValue(data[0]['Phone']);
      this.contactForm.get('PoBox').setValue(data[0]['PoBox']);
      this.contactForm.get('Telx').setValue(data[0]['Telx']);
      this.contactForm.get('E_Mail').setValue(data[0]['E_Mail']);
      this.contactForm.get('Fax').setValue(data[0]['Fax']);
    }    
  //#endregion


  ngOnChanges(changes: SimpleChanges) {
    // check new data
    const isChanged = setInterval(() => {
      if (typeof (changes.data) == 'undefined') {
        null;
      } else {
        this.data = changes.data.currentValue;
        (this.data.length > 0) && this.displayData(this.data);        
        clearInterval(isChanged);
      }
    }, 100); 
        
  }   

}
