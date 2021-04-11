import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseShipmentsInvoicesGridComponent } from './purchase-shipments-invoices-grid.component';

describe('PurchaseShipmentsInvoicesGridComponent', () => {
  let component: PurchaseShipmentsInvoicesGridComponent;
  let fixture: ComponentFixture<PurchaseShipmentsInvoicesGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseShipmentsInvoicesGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseShipmentsInvoicesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
