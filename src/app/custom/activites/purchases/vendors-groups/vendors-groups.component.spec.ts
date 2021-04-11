import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorsGroupsComponent } from './vendors-groups.component';

describe('VendorsGroupsComponent', () => {
  let component: VendorsGroupsComponent;
  let fixture: ComponentFixture<VendorsGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorsGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorsGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
