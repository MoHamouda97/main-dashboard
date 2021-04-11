import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOnsGridComponent } from './add-ons-grid.component';

describe('AddOnsGridComponent', () => {
  let component: AddOnsGridComponent;
  let fixture: ComponentFixture<AddOnsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOnsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOnsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
