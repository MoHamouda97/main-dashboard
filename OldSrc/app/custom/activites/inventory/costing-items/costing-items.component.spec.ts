import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostingItemsComponent } from './costing-items.component';

describe('CostingItemsComponent', () => {
  let component: CostingItemsComponent;
  let fixture: ComponentFixture<CostingItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostingItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostingItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
