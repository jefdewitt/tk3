import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCalendarComponent } from './app-calendar.component';
import { FormsModule } from '@angular/forms';
import { CalendarService } from '../../services/calendar.service';
import { GoalTrackService } from '../../services/goal-track.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppCalendarComponent', () => {
  let component: AppCalendarComponent;
  let fixture: ComponentFixture<AppCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppCalendarComponent ],
      imports: [ 
        FormsModule,  
        RouterTestingModule
      ],
      providers: [ 
        CalendarService,
        GoalTrackService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
