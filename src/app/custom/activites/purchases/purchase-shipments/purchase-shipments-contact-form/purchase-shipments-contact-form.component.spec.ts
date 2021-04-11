import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseShipmentsContactFormComponent } from './purchase-shipments-contact-form.component';

describe('PurchaseShipmentsContactFormComponent', () => {
  let component: PurchaseShipmentsContactFormComponent;
  let fixture: ComponentFixture<PurchaseShipmentsContactFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseShipmentsContactFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseShipmentsContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
