import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemExpireListComponent } from './item-expire-list.component';

describe('ItemExpireListComponent', () => {
  let component: ItemExpireListComponent;
  let fixture: ComponentFixture<ItemExpireListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemExpireListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemExpireListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
