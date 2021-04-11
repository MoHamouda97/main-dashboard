import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorDiscountsGridComponent } from './vendor-discounts-grid.component';

describe('VendorDiscountsGridComponent', () => {
  let component: VendorDiscountsGridComponent;
  let fixture: ComponentFixture<VendorDiscountsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorDiscountsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorDiscountsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
