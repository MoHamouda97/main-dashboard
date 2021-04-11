import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorsBasicDataComponent } from './vendors-basic-data.component';

describe('VendorsBasicDataComponent', () => {
  let component: VendorsBasicDataComponent;
  let fixture: ComponentFixture<VendorsBasicDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorsBasicDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorsBasicDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
