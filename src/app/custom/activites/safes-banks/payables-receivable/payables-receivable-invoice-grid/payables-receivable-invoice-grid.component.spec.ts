import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayablesReceivableInvoiceGridComponent } from './payables-receivable-invoice-grid.component';

describe('PayablesReceivableInvoiceGridComponent', () => {
  let component: PayablesReceivableInvoiceGridComponent;
  let fixture: ComponentFixture<PayablesReceivableInvoiceGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayablesReceivableInvoiceGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayablesReceivableInvoiceGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
