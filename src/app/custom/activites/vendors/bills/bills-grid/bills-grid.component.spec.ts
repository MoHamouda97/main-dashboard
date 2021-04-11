import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsGridComponent } from './bills-grid.component';

describe('BillsGridComponent', () => {
  let component: BillsGridComponent;
  let fixture: ComponentFixture<BillsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
