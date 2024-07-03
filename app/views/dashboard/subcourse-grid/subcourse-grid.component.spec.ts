import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcourseGridComponent } from './subcourse-grid.component';

describe('SubcourseGridComponent', () => {
  let component: SubcourseGridComponent;
  let fixture: ComponentFixture<SubcourseGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubcourseGridComponent]
    });
    fixture = TestBed.createComponent(SubcourseGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
