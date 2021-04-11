import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComRatiosUFormComponent } from './com-ratios-u-form.component';

describe('ComRatiosUFormComponent', () => {
  let component: ComRatiosUFormComponent;
  let fixture: ComponentFixture<ComRatiosUFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComRatiosUFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComRatiosUFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
