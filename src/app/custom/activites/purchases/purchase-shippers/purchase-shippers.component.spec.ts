import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseShippersComponent } from './purchase-shippers.component';

describe('PurchaseShippersComponent', () => {
  let component: PurchaseShippersComponent;
  let fixture: ComponentFixture<PurchaseShippersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseShippersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseShippersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
