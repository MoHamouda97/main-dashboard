import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpostingComponent } from './unposting.component';

describe('UnpostingComponent', () => {
  let component: UnpostingComponent;
  let fixture: ComponentFixture<UnpostingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnpostingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnpostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
