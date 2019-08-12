import { TestBed } from '@angular/core/testing';

import { TrackManagerService } from './track-manager.service';

describe('TrackManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrackManagerService = TestBed.get(TrackManagerService);
    expect(service).toBeTruthy();
  });
});
