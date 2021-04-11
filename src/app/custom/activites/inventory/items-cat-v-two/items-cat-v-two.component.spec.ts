import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsCatVTwoComponent } from './items-cat-v-two.component';

describe('ItemsCatVTwoComponent', () => {
  let component: ItemsCatVTwoComponent;
  let fixture: ComponentFixture<ItemsCatVTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsCatVTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsCatVTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
