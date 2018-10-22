import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppInputComponent } from './app-input.component';
import { FormsModule } from '@angular/forms';
import { CalendarService } from '../../services/calendar.service';
import { GoalTrackService } from '../../services/goal-track.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppInputComponent', () => {
  let component: AppInputComponent;
  let fixture: ComponentFixture<AppInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        AppInputComponent 
      ],
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
    fixture = TestBed.createComponent(AppInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
