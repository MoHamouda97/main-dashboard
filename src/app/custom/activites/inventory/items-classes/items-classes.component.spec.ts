import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsClassesComponent } from './items-classes.component';

describe('ItemsClassesComponent', () => {
  let component: ItemsClassesComponent;
  let fixture: ComponentFixture<ItemsClassesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsClassesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
