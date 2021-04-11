import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComPeriodPaymentFormComponent } from './com-period-payment-form.component';

describe('ComPeriodPaymentFormComponent', () => {
  let component: ComPeriodPaymentFormComponent;
  let fixture: ComponentFixture<ComPeriodPaymentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComPeriodPaymentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComPeriodPaymentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
