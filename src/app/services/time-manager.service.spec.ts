import { TestBed } from '@angular/core/testing';

import { TimeManagerService } from './time-manager.service';

describe('TimeManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TimeManagerService = TestBed.get(TimeManagerService);
    expect(service).toBeTruthy();
  });
});
