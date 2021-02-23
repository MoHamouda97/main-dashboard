import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryTransComponent } from './inventory-trans.component';

describe('InventoryTransComponent', () => {
  let component: InventoryTransComponent;
  let fixture: ComponentFixture<InventoryTransComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryTransComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryTransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
