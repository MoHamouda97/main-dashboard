import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpCategoryComponent } from './emp-category.component';

describe('EmpCategoryComponent', () => {
  let component: EmpCategoryComponent;
  let fixture: ComponentFixture<EmpCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
