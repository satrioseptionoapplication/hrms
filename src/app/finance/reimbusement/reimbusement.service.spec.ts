import { TestBed } from '@angular/core/testing';

import { ReimbusementsService } from './reimbusement.service';

describe('ReimbusementsService', () => {
  let service: ReimbusementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReimbusementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
