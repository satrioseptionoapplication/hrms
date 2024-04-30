import { TestBed } from '@angular/core/testing';

import { OvertimesService } from './overtimes.service';

describe('OvertimesService', () => {
  let service: OvertimesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OvertimesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
