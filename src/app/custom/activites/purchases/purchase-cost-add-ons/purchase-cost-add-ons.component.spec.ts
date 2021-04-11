import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseCostAddOnsComponent } from './purchase-cost-add-ons.component';

describe('PurchaseCostAddOnsComponent', () => {
  let component: PurchaseCostAddOnsComponent;
  let fixture: ComponentFixture<PurchaseCostAddOnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseCostAddOnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseCostAddOnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
