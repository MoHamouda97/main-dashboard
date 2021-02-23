import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelOpenComponent } from './cancel-open.component';

describe('CancelOpenComponent', () => {
  let component: CancelOpenComponent;
  let fixture: ComponentFixture<CancelOpenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelOpenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelOpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
