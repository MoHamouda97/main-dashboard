import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MpgComponent } from './mpg.component';

describe('MpgComponent', () => {
  let component: MpgComponent;
  let fixture: ComponentFixture<MpgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MpgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MpgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
