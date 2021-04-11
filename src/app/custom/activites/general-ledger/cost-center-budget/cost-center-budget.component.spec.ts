import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCenterBudgetComponent } from './cost-center-budget.component';

describe('CostCenterBudgetComponent', () => {
  let component: CostCenterBudgetComponent;
  let fixture: ComponentFixture<CostCenterBudgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostCenterBudgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
