import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseShipmentsComponent } from './purchase-shipments.component';

describe('PurchaseShipmentsComponent', () => {
  let component: PurchaseShipmentsComponent;
  let fixture: ComponentFixture<PurchaseShipmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseShipmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseShipmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
