import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationsUFormComponent } from './quotations-u-form.component';

describe('QuotationsUFormComponent', () => {
  let component: QuotationsUFormComponent;
  let fixture: ComponentFixture<QuotationsUFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationsUFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationsUFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
