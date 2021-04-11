import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionPariodComponent } from './commission-pariod.component';

describe('CommissionPariodComponent', () => {
  let component: CommissionPariodComponent;
  let fixture: ComponentFixture<CommissionPariodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommissionPariodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionPariodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
