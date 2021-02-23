import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsInBranchesComponent } from './items-in-branches.component';

describe('ItemsInBranchesComponent', () => {
  let component: ItemsInBranchesComponent;
  let fixture: ComponentFixture<ItemsInBranchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsInBranchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsInBranchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
