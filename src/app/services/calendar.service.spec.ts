import { TestBed, inject } from '@angular/core/testing';

import { CalendarService } from './calendar.service';
import { GoalTrackService } from './goal-track.service';

import { RouterTestingModule } from '@angular/router/testing';

describe('CalendarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      providers: [
        CalendarService,
        GoalTrackService
      ]
    });
  });

  it('should be created', inject([CalendarService], (service: CalendarService) => {
    expect(service).toBeTruthy();
  }));
  
});
