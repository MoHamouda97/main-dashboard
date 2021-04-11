import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseShipmentsFollowGridComponent } from './purchase-shipments-follow-grid.component';

describe('PurchaseShipmentsFollowGridComponent', () => {
  let component: PurchaseShipmentsFollowGridComponent;
  let fixture: ComponentFixture<PurchaseShipmentsFollowGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseShipmentsFollowGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseShipmentsFollowGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
