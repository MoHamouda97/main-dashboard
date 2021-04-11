import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationUFormComponent } from './reservation-u-form.component';

describe('ReservationUFormComponent', () => {
  let component: ReservationUFormComponent;
  let fixture: ComponentFixture<ReservationUFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationUFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationUFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
