import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorItemsGridComponent } from './vendor-items-grid.component';

describe('VendorItemsGridComponent', () => {
  let component: VendorItemsGridComponent;
  let fixture: ComponentFixture<VendorItemsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorItemsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorItemsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
