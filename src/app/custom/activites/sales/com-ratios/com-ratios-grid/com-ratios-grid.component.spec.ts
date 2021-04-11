import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComRatiosGridComponent } from './com-ratios-grid.component';

describe('ComRatiosGridComponent', () => {
  let component: ComRatiosGridComponent;
  let fixture: ComponentFixture<ComRatiosGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComRatiosGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComRatiosGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
