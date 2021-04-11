import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgementsComponent } from './acknowledgements.component';

describe('AcknowledgementsComponent', () => {
  let component: AcknowledgementsComponent;
  let fixture: ComponentFixture<AcknowledgementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcknowledgementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcknowledgementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
