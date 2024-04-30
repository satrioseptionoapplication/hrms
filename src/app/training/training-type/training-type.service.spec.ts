import { TestBed } from '@angular/core/testing';

import { TrainingTypesService } from './trainers.service';

describe('TrainingTypesService', () => {
  let service: TrainingTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
