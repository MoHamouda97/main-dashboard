import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesQuotationsComponent } from './sales-quotations.component';

describe('SalesQuotationsComponent', () => {
  let component: SalesQuotationsComponent;
  let fixture: ComponentFixture<SalesQuotationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesQuotationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesQuotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
