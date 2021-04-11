import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComPeriodUFormComponent } from './com-period-u-form.component';

describe('ComPeriodUFormComponent', () => {
  let component: ComPeriodUFormComponent;
  let fixture: ComponentFixture<ComPeriodUFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComPeriodUFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComPeriodUFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
