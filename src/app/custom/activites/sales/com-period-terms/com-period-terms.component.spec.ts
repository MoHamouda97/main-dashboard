import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComPeriodTermsComponent } from './com-period-terms.component';

describe('ComPeriodTermsComponent', () => {
  let component: ComPeriodTermsComponent;
  let fixture: ComponentFixture<ComPeriodTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComPeriodTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComPeriodTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
