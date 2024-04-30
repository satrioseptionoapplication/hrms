import { TestBed } from '@angular/core/testing';

import { leaveApprovalservice } from './leave-employee.service';

describe('leaveApprovalservice', () => {
  let service: leaveApprovalservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(leaveApprovalservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
