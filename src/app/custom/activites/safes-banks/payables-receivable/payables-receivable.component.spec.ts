import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayablesReceivableComponent } from './payables-receivable.component';

describe('PayablesReceivableComponent', () => {
  let component: PayablesReceivableComponent;
  let fixture: ComponentFixture<PayablesReceivableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayablesReceivableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayablesReceivableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
