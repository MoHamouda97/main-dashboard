import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceListGridComponent } from './price-list-grid.component';

describe('PriceListGridComponent', () => {
  let component: PriceListGridComponent;
  let fixture: ComponentFixture<PriceListGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceListGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceListGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
