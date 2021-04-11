import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComPeriodGridComponent } from './com-period-grid.component';

describe('ComPeriodGridComponent', () => {
  let component: ComPeriodGridComponent;
  let fixture: ComponentFixture<ComPeriodGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComPeriodGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComPeriodGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
