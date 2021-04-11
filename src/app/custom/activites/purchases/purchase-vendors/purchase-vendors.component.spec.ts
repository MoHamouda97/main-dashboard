import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseVendorsComponent } from './purchase-vendors.component';

describe('PurchaseVendorsComponent', () => {
  let component: PurchaseVendorsComponent;
  let fixture: ComponentFixture<PurchaseVendorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseVendorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseVendorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
