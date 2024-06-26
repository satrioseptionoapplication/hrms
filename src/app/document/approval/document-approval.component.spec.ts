import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentApprovalComponent } from './document-approval.component';

describe('DocumentApprovalComponent', () => {
  let component: DocumentApprovalComponent;
  let fixture: ComponentFixture<DocumentApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentApprovalComponent],
    });
    fixture = TestBed.createComponent(DocumentApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
