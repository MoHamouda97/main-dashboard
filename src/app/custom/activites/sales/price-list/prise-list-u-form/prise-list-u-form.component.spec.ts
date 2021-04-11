import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriseListUFormComponent } from './prise-list-u-form.component';

describe('PriseListUFormComponent', () => {
  let component: PriseListUFormComponent;
  let fixture: ComponentFixture<PriseListUFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriseListUFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriseListUFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
