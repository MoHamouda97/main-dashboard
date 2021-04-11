import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsCatVThreeComponent } from './items-cat-v-three.component';

describe('ItemsCatVThreeComponent', () => {
  let component: ItemsCatVThreeComponent;
  let fixture: ComponentFixture<ItemsCatVThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsCatVThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsCatVThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
