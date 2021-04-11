import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceUFormComponent } from './invoice-u-form.component';

describe('InvoiceUFormComponent', () => {
  let component: InvoiceUFormComponent;
  let fixture: ComponentFixture<InvoiceUFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceUFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceUFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
