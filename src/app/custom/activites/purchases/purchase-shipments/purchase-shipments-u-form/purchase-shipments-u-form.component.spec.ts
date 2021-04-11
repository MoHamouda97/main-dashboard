import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseShipmentsUFormComponent } from './purchase-shipments-u-form.component';

describe('PurchaseShipmentsUFormComponent', () => {
  let component: PurchaseShipmentsUFormComponent;
  let fixture: ComponentFixture<PurchaseShipmentsUFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseShipmentsUFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseShipmentsUFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
