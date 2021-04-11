import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCategoriesComponent } from './vendor-categories.component';

describe('VendorCategoriesComponent', () => {
  let component: VendorCategoriesComponent;
  let fixture: ComponentFixture<VendorCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
