import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsGroupComponent } from './items-group.component';

describe('ItemsGroupComponent', () => {
  let component: ItemsGroupComponent;
  let fixture: ComponentFixture<ItemsGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
