import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsCatVOneComponent } from './items-cat-v-one.component';

describe('ItemsCatVOneComponent', () => {
  let component: ItemsCatVOneComponent;
  let fixture: ComponentFixture<ItemsCatVOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsCatVOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsCatVOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
