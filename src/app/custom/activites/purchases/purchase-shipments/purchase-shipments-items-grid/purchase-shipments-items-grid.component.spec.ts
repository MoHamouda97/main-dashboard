import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseShipmentsItemsGridComponent } from './purchase-shipments-items-grid.component';

describe('PurchaseShipmentsItemsGridComponent', () => {
  let component: PurchaseShipmentsItemsGridComponent;
  let fixture: ComponentFixture<PurchaseShipmentsItemsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseShipmentsItemsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseShipmentsItemsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
