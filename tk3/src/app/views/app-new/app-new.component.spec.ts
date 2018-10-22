import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppNewComponent } from './app-new.component';
import { FormsModule } from '@angular/forms';
import { CalendarService } from '../../services/calendar.service';
import { GoalTrackService } from '../../services/goal-track.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppNewComponent', () => {
  let component: AppNewComponent;
  let fixture: ComponentFixture<AppNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        AppNewComponent 
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
    fixture = TestBed.createComponent(AppNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
