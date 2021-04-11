import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseShipmentsMissedControlesComponent } from './purchase-shipments-missed-controles.component';

describe('PurchaseShipmentsMissedControlesComponent', () => {
  let component: PurchaseShipmentsMissedControlesComponent;
  let fixture: ComponentFixture<PurchaseShipmentsMissedControlesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseShipmentsMissedControlesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseShipmentsMissedControlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
