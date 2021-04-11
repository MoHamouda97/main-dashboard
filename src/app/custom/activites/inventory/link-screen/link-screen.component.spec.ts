import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkScreenComponent } from './link-screen.component';

describe('LinkScreenComponent', () => {
  let component: LinkScreenComponent;
  let fixture: ComponentFixture<LinkScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
