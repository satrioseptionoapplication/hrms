import { TestBed } from '@angular/core/testing';

import { ListTrainingService } from './training-list.service';

describe('ListTrainingService', () => {
  let service: ListTrainingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListTrainingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
