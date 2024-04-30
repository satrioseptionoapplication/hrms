import { TestBed } from '@angular/core/testing';

import { DocumentApprovalService } from './document-approval.service';

describe('DocumentApprovalService', () => {
  let service: DocumentApprovalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentApprovalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
