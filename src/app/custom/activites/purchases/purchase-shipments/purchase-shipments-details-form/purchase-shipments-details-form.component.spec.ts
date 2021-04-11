import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseShipmentsDetailsFormComponent } from './purchase-shipments-details-form.component';

describe('PurchaseShipmentsDetailsFormComponent', () => {
  let component: PurchaseShipmentsDetailsFormComponent;
  let fixture: ComponentFixture<PurchaseShipmentsDetailsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseShipmentsDetailsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseShipmentsDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
