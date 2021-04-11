import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComRatiosComponent } from './com-ratios.component';

describe('ComRatiosComponent', () => {
  let component: ComRatiosComponent;
  let fixture: ComponentFixture<ComRatiosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComRatiosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComRatiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
