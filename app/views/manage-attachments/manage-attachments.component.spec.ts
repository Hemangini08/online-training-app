import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAttachmentsComponent } from './manage-attachments.component';

describe('ManageAttachmentsComponent', () => {
  let component: ManageAttachmentsComponent;
  let fixture: ComponentFixture<ManageAttachmentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageAttachmentsComponent]
    });
    fixture = TestBed.createComponent(ManageAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
