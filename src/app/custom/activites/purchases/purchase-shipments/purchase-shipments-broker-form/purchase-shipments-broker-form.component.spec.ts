import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseShipmentsBrokerFormComponent } from './purchase-shipments-broker-form.component';

describe('PurchaseShipmentsBrokerFormComponent', () => {
  let component: PurchaseShipmentsBrokerFormComponent;
  let fixture: ComponentFixture<PurchaseShipmentsBrokerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseShipmentsBrokerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseShipmentsBrokerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
