import { TestBed } from '@angular/core/testing';

import { LeaveEmployeeService } from './leave-employee.service';

describe('LeaveEmployeeService', () => {
  let service: LeaveEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaveEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
