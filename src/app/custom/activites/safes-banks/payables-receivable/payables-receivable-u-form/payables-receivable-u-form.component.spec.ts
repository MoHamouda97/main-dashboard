import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayablesReceivableUFormComponent } from './payables-receivable-u-form.component';

describe('PayablesReceivableUFormComponent', () => {
  let component: PayablesReceivableUFormComponent;
  let fixture: ComponentFixture<PayablesReceivableUFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayablesReceivableUFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayablesReceivableUFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
