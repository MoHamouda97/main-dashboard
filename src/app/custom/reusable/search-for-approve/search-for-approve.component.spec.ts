import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchForApproveComponent } from './search-for-approve.component';

describe('SearchForApproveComponent', () => {
  let component: SearchForApproveComponent;
  let fixture: ComponentFixture<SearchForApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchForApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchForApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
