import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsUFormComponent } from './bills-u-form.component';

describe('BillsUFormComponent', () => {
  let component: BillsUFormComponent;
  let fixture: ComponentFixture<BillsUFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillsUFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillsUFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
