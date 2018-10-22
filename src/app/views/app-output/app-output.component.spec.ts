import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppOutputComponent } from './app-output.component';
import { FormsModule } from '@angular/forms';
import { CalendarService } from '../../services/calendar.service';
import { GoalTrackService } from '../../services/goal-track.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppOutputComponent', () => {
  let component: AppOutputComponent;
  let fixture: ComponentFixture<AppOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        AppOutputComponent 
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
    fixture = TestBed.createComponent(AppOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
