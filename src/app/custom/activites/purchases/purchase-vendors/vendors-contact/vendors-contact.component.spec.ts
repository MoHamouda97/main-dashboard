import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorsContactComponent } from './vendors-contact.component';

describe('VendorsContactComponent', () => {
  let component: VendorsContactComponent;
  let fixture: ComponentFixture<VendorsContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorsContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorsContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
