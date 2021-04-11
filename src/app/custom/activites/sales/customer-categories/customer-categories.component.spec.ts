import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCategoriesComponent } from './customer-categories.component';

describe('CustomerCategoriesComponent', () => {
  let component: CustomerCategoriesComponent;
  let fixture: ComponentFixture<CustomerCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
