import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseVendorPriceListComponent } from './purchase-vendor-price-list.component';

describe('PurchaseVendorPriceListComponent', () => {
  let component: PurchaseVendorPriceListComponent;
  let fixture: ComponentFixture<PurchaseVendorPriceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseVendorPriceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseVendorPriceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
