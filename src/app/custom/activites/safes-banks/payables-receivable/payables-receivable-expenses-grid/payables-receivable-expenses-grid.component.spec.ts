import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayablesReceivableExpensesGridComponent } from './payables-receivable-expenses-grid.component';

describe('PayablesReceivableExpensesGridComponent', () => {
  let component: PayablesReceivableExpensesGridComponent;
  let fixture: ComponentFixture<PayablesReceivableExpensesGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayablesReceivableExpensesGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayablesReceivableExpensesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
