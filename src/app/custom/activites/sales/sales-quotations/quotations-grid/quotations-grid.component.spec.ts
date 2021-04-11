import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationsGridComponent } from './quotations-grid.component';

describe('QuotationsGridComponent', () => {
  let component: QuotationsGridComponent;
  let fixture: ComponentFixture<QuotationsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
